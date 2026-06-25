import re

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.text import slugify


DANGEROUS_TAG_RE = re.compile(r"<\s*(iframe|object|embed|base|meta|link)\b", re.IGNORECASE)
EXTERNAL_SCRIPT_RE = re.compile(r"<\s*script[^>]+\bsrc\s*=", re.IGNORECASE)
EVENT_HANDLER_RE = re.compile(r"\son[a-z]+\s*=", re.IGNORECASE)
JAVASCRIPT_URL_RE = re.compile(r"javascript\s*:", re.IGNORECASE)
CSS_IMPORT_RE = re.compile(r"@import\s+url", re.IGNORECASE)


class PracticeTask(models.Model):
    class TestType(models.TextChoices):
        READING = "reading", "Reading"
        LISTENING = "listening", "Listening"
        WRITING = "writing", "Writing"
        SPEAKING = "speaking", "Speaking"

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    test_type = models.CharField(max_length=20, choices=TestType.choices)
    section_number = models.PositiveSmallIntegerField(default=1)
    duration_minutes = models.PositiveSmallIntegerField(default=60)
    html_content = models.TextField(
        help_text=(
            "Paste trusted, self-contained task HTML. Inline CSS/JS is allowed; "
            "external scripts, iframes, and inline event attributes are rejected."
        )
    )
    answer_key = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["test_type", "section_number", "title"]

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if not isinstance(self.answer_key, dict):
            raise ValidationError({"answer_key": "Answer key must be a JSON object."})

        html = self.html_content or ""
        blocked = []
        checks = [
            (DANGEROUS_TAG_RE, "iframe/object/embed/base/meta/link tags"),
            (EXTERNAL_SCRIPT_RE, "external script src attributes"),
            (EVENT_HANDLER_RE, "inline event attributes such as onclick/onerror"),
            (JAVASCRIPT_URL_RE, "javascript: URLs"),
            (CSS_IMPORT_RE, "CSS @import rules"),
        ]
        for pattern, label in checks:
            if pattern.search(html):
                blocked.append(label)
        if blocked:
            raise ValidationError(
                {
                    "html_content": (
                        "This HTML contains blocked patterns: "
                        + ", ".join(blocked)
                        + ". Use trusted, self-contained HTML with addEventListener-based JS."
                    )
                }
            )

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or "practice-task"
            slug = base_slug
            counter = 2
            while PracticeTask.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        self.full_clean()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("practice:task_detail", kwargs={"slug": self.slug})


class PracticeAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    task = models.ForeignKey(PracticeTask, on_delete=models.CASCADE, related_name="attempts")
    answers = models.JSONField(default=dict, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    notes = models.JSONField(default=list, blank=True)
    score = models.PositiveIntegerField(null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    time_spent_seconds = models.PositiveIntegerField(default=0)
    is_submitted = models.BooleanField(default=False)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user", "task", "is_submitted"], name="practice_pr_user_id_23cd3e_idx"),
            models.Index(fields=["submitted_at"], name="practice_pr_submitt_1857dc_idx"),
        ]

    def __str__(self):
        return f"{self.user} - {self.task} ({'submitted' if self.is_submitted else 'in progress'})"

    @property
    def total_questions(self):
        return len(self.task.answer_key or {})

    def mark_submitted(self, answers, time_spent_seconds, highlights=None, notes=None):
        self.answers = answers
        self.highlights = normalize_list_payload(highlights)
        self.notes = normalize_list_payload(notes)
        self.time_spent_seconds = max(int(time_spent_seconds or 0), 0)
        self.score = score_answers(self.task.answer_key or {}, answers or {})
        self.submitted_at = timezone.now()
        self.is_submitted = True
        self.save(
            update_fields=[
                "answers",
                "highlights",
                "notes",
                "time_spent_seconds",
                "score",
                "submitted_at",
                "is_submitted",
            ]
        )


def normalize_answer(value):
    if value is None:
        return ""
    if isinstance(value, (int, float, bool)):
        value = str(value)
    return " ".join(str(value).strip().lower().split())


def normalize_list_payload(value):
    if isinstance(value, list):
        return value
    return []


def answer_matches(expected, actual):
    actual_normalized = normalize_answer(actual)
    if isinstance(expected, list):
        return any(normalize_answer(option) == actual_normalized for option in expected)
    return normalize_answer(expected) == actual_normalized


def score_answers(answer_key, answers):
    score = 0
    for question_number, expected in answer_key.items():
        if answer_matches(expected, answers.get(str(question_number))):
            score += 1
    return score


class Test(models.Model):
    class Skill(models.TextChoices):
        LISTENING = "listening", "Listening"
        READING = "reading", "Reading"
        WRITING = "writing", "Writing"
        SPEAKING = "speaking", "Speaking"
        ARTICLE = "article", "Article"
        DICTATION = "dictation", "Dictation"
        PODCAST = "podcast", "Podcast"

    class SectionType(models.TextChoices):
        PART1 = "part1", "Part 1"
        PART2 = "part2", "Part 2"
        PART3 = "part3", "Part 3"
        PART4 = "part4", "Part 4"
        PASSAGE1 = "passage1", "Passage 1"
        PASSAGE2 = "passage2", "Passage 2"
        PASSAGE3 = "passage3", "Passage 3"
        TASK1 = "task1", "Task 1"
        TASK2 = "task2", "Task 2"
        FULL = "full", "Full"

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    skill = models.CharField(max_length=20, choices=Skill.choices)
    section_type = models.CharField(max_length=20, choices=SectionType.choices)
    html_content = models.TextField(
        help_text="Trusted teacher HTML. It renders with {{ test.html_content|safe }} in the test runner."
    )
    audio_file = models.FileField(upload_to="test_audio/", blank=True, null=True)
    answer_key = models.JSONField(default=dict, blank=True)
    duration_minutes = models.PositiveSmallIntegerField(default=60)
    allow_highlighting = models.BooleanField(default=True)
    auto_play_audio = models.BooleanField(default=False)
    mobile_optimized = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_tests",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["skill", "section_type", "title"]
        indexes = [
            models.Index(fields=["skill", "section_type", "is_published"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if not isinstance(self.answer_key, dict):
            raise ValidationError({"answer_key": "Answer key must be a JSON object."})
        validate_trusted_html(self.html_content)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug_for_model(Test, self.title, self.pk)
        self.full_clean()
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse("practice:test_detail", kwargs={"slug": self.slug})

    @property
    def is_auto_checked(self):
        return self.skill in {self.Skill.READING, self.Skill.LISTENING, self.Skill.DICTATION}


class TestAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE, related_name="attempts")
    answers = models.JSONField(default=dict, blank=True)
    notes = models.JSONField(default=list, blank=True)
    score = models.PositiveIntegerField(null=True, blank=True)
    mistakes = models.JSONField(default=dict, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    time_spent_seconds = models.PositiveIntegerField(default=0)
    is_submitted = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)

    class Meta:
        ordering = ["-started_at"]
        indexes = [
            models.Index(fields=["user", "test", "is_submitted"]),
            models.Index(fields=["is_locked"]),
        ]

    def __str__(self):
        return f"{self.user} - {self.test} ({'submitted' if self.is_submitted else 'in progress'})"

    @property
    def total_questions(self):
        return len(self.test.answer_key or {})

    def mark_submitted(self, answers, time_spent_seconds, notes=None):
        score, mistakes = score_with_mistakes(self.test.answer_key or {}, answers or {})
        self.answers = answers or {}
        self.notes = normalize_list_payload(notes)
        self.score = score
        self.mistakes = mistakes
        self.time_spent_seconds = max(int(time_spent_seconds or 0), 0)
        self.submitted_at = timezone.now()
        self.is_submitted = True
        self.is_locked = True
        self.save(
            update_fields=[
                "answers",
                "notes",
                "score",
                "mistakes",
                "time_spent_seconds",
                "submitted_at",
                "is_submitted",
                "is_locked",
            ]
        )


class Highlight(models.Model):
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name="highlights")
    selected_text = models.TextField()
    context = models.TextField(blank=True)
    color = models.CharField(max_length=24, default="yellow")
    client_id = models.CharField(max_length=80, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return self.selected_text[:80]


class DictationExercise(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    audio_file = models.FileField(upload_to="dictation_audio/")
    transcript = models.TextField()
    html_content = models.TextField(blank=True)
    duration_minutes = models.PositiveSmallIntegerField(default=20)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_dictations",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug_for_model(DictationExercise, self.title, self.pk)
        super().save(*args, **kwargs)


class DictationAttempt(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    exercise = models.ForeignKey(DictationExercise, on_delete=models.CASCADE, related_name="attempts")
    submitted_text = models.TextField(blank=True)
    accuracy_percent = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    mistakes = models.JSONField(default=list, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    is_submitted = models.BooleanField(default=False)

    class Meta:
        ordering = ["-started_at"]

    def mark_submitted(self, submitted_text):
        accuracy, mistakes = calculate_dictation_accuracy(self.exercise.transcript, submitted_text)
        self.submitted_text = submitted_text
        self.accuracy_percent = accuracy
        self.mistakes = mistakes
        self.submitted_at = timezone.now()
        self.is_submitted = True
        self.save(update_fields=["submitted_text", "accuracy_percent", "mistakes", "submitted_at", "is_submitted"])


class Article(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    html_content = models.TextField()
    audio_file = models.FileField(upload_to="article_audio/", blank=True, null=True)
    vocabulary = models.JSONField(default=dict, blank=True)
    allow_highlighting = models.BooleanField(default=True)
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_articles",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

    def clean(self):
        super().clean()
        if not isinstance(self.vocabulary, dict):
            raise ValidationError({"vocabulary": "Vocabulary must be a JSON object."})
        validate_trusted_html(self.html_content)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug_for_model(Article, self.title, self.pk)
        self.full_clean()
        super().save(*args, **kwargs)


class FullMockTest(models.Model):
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    listening_test = models.ForeignKey(
        Test,
        on_delete=models.PROTECT,
        related_name="mock_listening_sections",
        limit_choices_to={"skill": Test.Skill.LISTENING},
    )
    reading_test = models.ForeignKey(
        Test,
        on_delete=models.PROTECT,
        related_name="mock_reading_sections",
        limit_choices_to={"skill": Test.Skill.READING},
    )
    writing_test = models.ForeignKey(
        Test,
        on_delete=models.PROTECT,
        related_name="mock_writing_sections",
        limit_choices_to={"skill": Test.Skill.WRITING},
    )
    is_published = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_mock_tests",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = unique_slug_for_model(FullMockTest, self.title, self.pk)
        super().save(*args, **kwargs)


def validate_trusted_html(html):
    html = html or ""
    blocked = []
    checks = [
        (DANGEROUS_TAG_RE, "iframe/object/embed/base/meta/link tags"),
        (EXTERNAL_SCRIPT_RE, "external script src attributes"),
        (EVENT_HANDLER_RE, "inline event attributes such as onclick/onerror"),
        (JAVASCRIPT_URL_RE, "javascript: URLs"),
        (CSS_IMPORT_RE, "CSS @import rules"),
    ]
    for pattern, label in checks:
        if pattern.search(html):
            blocked.append(label)
    if blocked:
        raise ValidationError(
            {
                "html_content": (
                    "This HTML contains blocked patterns: "
                    + ", ".join(blocked)
                    + ". Only trusted self-contained teacher HTML is supported."
                )
            }
        )


def unique_slug_for_model(model_class, title, pk=None):
    base_slug = slugify(title) or model_class.__name__.lower()
    slug = base_slug
    counter = 2
    queryset = model_class.objects.filter(slug=slug)
    if pk:
        queryset = queryset.exclude(pk=pk)
    while queryset.exists():
        slug = f"{base_slug}-{counter}"
        counter += 1
        queryset = model_class.objects.filter(slug=slug)
        if pk:
            queryset = queryset.exclude(pk=pk)
    return slug


def score_with_mistakes(answer_key, answers):
    score = 0
    mistakes = {}
    for question_number, expected in answer_key.items():
        actual = answers.get(str(question_number))
        if answer_matches(expected, actual):
            score += 1
        else:
            mistakes[str(question_number)] = {
                "expected": expected,
                "actual": actual,
            }
    return score, mistakes


def calculate_dictation_accuracy(transcript, submitted_text):
    expected_words = normalize_answer(transcript).split()
    actual_words = normalize_answer(submitted_text).split()
    if not expected_words:
        return 0, []

    correct = 0
    mistakes = []
    max_len = max(len(expected_words), len(actual_words))
    for index in range(max_len):
        expected = expected_words[index] if index < len(expected_words) else ""
        actual = actual_words[index] if index < len(actual_words) else ""
        if expected and expected == actual:
            correct += 1
        else:
            mistakes.append({"position": index + 1, "expected": expected, "actual": actual})

    accuracy = round((correct / len(expected_words)) * 100, 2)
    return accuracy, mistakes
