import json

from django.contrib.auth.decorators import login_required
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.views.decorators.http import require_POST

from .forms import ArticleForm, DictationExerciseForm, FullMockTestForm, TestForm
from .models import (
    Article,
    DictationAttempt,
    DictationExercise,
    FullMockTest,
    Highlight,
    PracticeAttempt,
    PracticeTask,
    Test,
    TestAttempt,
)


@login_required
def task_list(request):
    tasks = PracticeTask.objects.filter(is_active=True).order_by("test_type", "section_number", "title")
    test_type = request.GET.get("type")
    if test_type in PracticeTask.TestType.values:
        tasks = tasks.filter(test_type=test_type)

    attempts = PracticeAttempt.objects.filter(user=request.user, task__in=tasks)
    latest_attempts = {}
    for attempt in attempts.order_by("task_id", "-started_at"):
        latest_attempts.setdefault(attempt.task_id, attempt)

    task_cards = [{"task": task, "latest_attempt": latest_attempts.get(task.id)} for task in tasks]

    return render(
        request,
        "practice/practice_list.html",
        {
            "task_cards": task_cards,
            "test_types": PracticeTask.TestType.choices,
            "selected_type": test_type,
        },
    )


@login_required
def task_detail(request, slug):
    task = get_object_or_404(PracticeTask, slug=slug, is_active=True)
    attempt = _get_attempt_for_detail(request, task)
    if attempt.is_submitted:
        return redirect("practice:result", attempt_id=attempt.id)
    return render(
        request,
        "practice/practice_detail.html",
        {
            "task": task,
            "attempt": attempt,
            "save_url": reverse("practice:save_attempt", kwargs={"attempt_id": attempt.id}),
            "submit_url": reverse("practice:submit_attempt", kwargs={"attempt_id": attempt.id}),
            "existing_answers": attempt.answers or {},
            "existing_highlights": attempt.highlights or [],
            "existing_notes": attempt.notes or [],
        },
    )


@login_required
def start_attempt(request, slug):
    task = get_object_or_404(PracticeTask, slug=slug, is_active=True)
    attempt = PracticeAttempt.objects.create(user=request.user, task=task)
    return redirect(f"{task.get_absolute_url()}?attempt={attempt.id}")


@login_required
@require_POST
def save_attempt(request, attempt_id):
    attempt = get_object_or_404(PracticeAttempt, id=attempt_id)
    _ensure_attempt_owner(request, attempt)
    if attempt.is_submitted:
        return JsonResponse({"success": False, "error": "This attempt has already been submitted."}, status=400)

    payload = _json_payload(request)
    answers = payload.get("answers", {})
    highlights = payload.get("highlights", [])
    notes = payload.get("notes", [])
    if not isinstance(answers, dict):
        return JsonResponse({"success": False, "error": "Answers must be a JSON object."}, status=400)
    if not isinstance(highlights, list):
        return JsonResponse({"success": False, "error": "Highlights must be a JSON array."}, status=400)
    if not isinstance(notes, list):
        return JsonResponse({"success": False, "error": "Notes must be a JSON array."}, status=400)

    attempt.answers = {str(key): value for key, value in answers.items()}
    attempt.highlights = highlights
    attempt.notes = notes
    attempt.save(update_fields=["answers", "highlights", "notes"])
    return JsonResponse(
        {
            "success": True,
            "saved_answers": len(attempt.answers),
            "saved_highlights": len(attempt.highlights),
            "saved_notes": len(attempt.notes),
        }
    )


@login_required
@require_POST
def submit_attempt(request, attempt_id):
    attempt = get_object_or_404(PracticeAttempt, id=attempt_id)
    _ensure_attempt_owner(request, attempt)
    if attempt.is_submitted:
        return JsonResponse(
            {
                "success": True,
                "redirect_url": reverse("practice:result", kwargs={"attempt_id": attempt.id}),
            }
        )

    payload = _json_payload(request)
    answers = payload.get("answers", {})
    highlights = payload.get("highlights", [])
    notes = payload.get("notes", [])
    if not isinstance(answers, dict):
        return JsonResponse({"success": False, "error": "Answers must be a JSON object."}, status=400)
    if not isinstance(highlights, list):
        return JsonResponse({"success": False, "error": "Highlights must be a JSON array."}, status=400)
    if not isinstance(notes, list):
        return JsonResponse({"success": False, "error": "Notes must be a JSON array."}, status=400)

    attempt.mark_submitted(
        answers={str(key): value for key, value in answers.items()},
        highlights=highlights,
        notes=notes,
        time_spent_seconds=payload.get("time_spent_seconds", 0),
    )
    return JsonResponse(
        {
            "success": True,
            "score": attempt.score,
            "total": attempt.total_questions,
            "redirect_url": reverse("practice:result", kwargs={"attempt_id": attempt.id}),
        }
    )


@login_required
def result(request, attempt_id):
    attempt = get_object_or_404(PracticeAttempt.objects.select_related("task", "user"), id=attempt_id)
    _ensure_attempt_owner(request, attempt)
    return render(request, "practice/result.html", {"attempt": attempt})


def _get_attempt_for_detail(request, task):
    requested_attempt_id = request.GET.get("attempt")
    if requested_attempt_id:
        attempt = get_object_or_404(PracticeAttempt, id=requested_attempt_id, task=task)
        _ensure_attempt_owner(request, attempt)
        return attempt

    attempt = (
        PracticeAttempt.objects.filter(user=request.user, task=task, is_submitted=False)
        .order_by("-started_at")
        .first()
    )
    if attempt:
        return attempt
    return PracticeAttempt.objects.create(user=request.user, task=task)


def _ensure_attempt_owner(request, attempt):
    if attempt.user_id != request.user.id:
        raise PermissionDenied("You can only access your own practice attempts.")


def _json_payload(request):
    try:
        return json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return {}


@login_required
def test_list(request):
    tests = Test.objects.filter(is_published=True).order_by("skill", "section_type", "title")
    skill = request.GET.get("skill")
    section_type = request.GET.get("section")
    if skill in Test.Skill.values:
        tests = tests.filter(skill=skill)
    if section_type in Test.SectionType.values:
        tests = tests.filter(section_type=section_type)

    attempts = TestAttempt.objects.filter(user=request.user, test__in=tests).order_by("test_id", "-started_at")
    latest_attempts = {}
    for attempt in attempts:
        latest_attempts.setdefault(attempt.test_id, attempt)

    cards = [{"test": test, "latest_attempt": latest_attempts.get(test.id)} for test in tests]
    return render(
        request,
        "practice/platform/test_list.html",
        {
            "cards": cards,
            "skills": Test.Skill.choices,
            "sections": Test.SectionType.choices,
            "selected_skill": skill,
            "selected_section": section_type,
        },
    )


@login_required
def test_detail(request, slug):
    test = get_object_or_404(Test, slug=slug, is_published=True)
    latest_attempt = TestAttempt.objects.filter(user=request.user, test=test).order_by("-started_at").first()
    return render(request, "practice/platform/test_detail.html", {"test": test, "latest_attempt": latest_attempt})


@login_required
def start_test_attempt(request, slug):
    test = get_object_or_404(Test, slug=slug, is_published=True)
    attempt = TestAttempt.objects.create(user=request.user, test=test)
    return redirect("practice:test_runner", attempt_id=attempt.id)


@login_required
def test_runner(request, attempt_id):
    attempt = get_object_or_404(TestAttempt.objects.select_related("test", "user"), id=attempt_id)
    _ensure_test_attempt_owner(request, attempt)
    if attempt.is_locked:
        return redirect("practice:test_result", attempt_id=attempt.id)
    highlights = list(attempt.highlights.values("client_id", "selected_text", "context", "color", "created_at"))
    existing_answers = attempt.answers or {}
    existing_notes = attempt.notes or []
    runner_config = {
        "attemptId": attempt.id,
        "durationMinutes": attempt.test.duration_minutes,
        "saveUrl": reverse("practice:test_attempt_save", kwargs={"attempt_id": attempt.id}),
        "submitUrl": reverse("practice:test_attempt_submit", kwargs={"attempt_id": attempt.id}),
        "highlightSaveUrl": reverse("practice:test_attempt_highlights_save", kwargs={"attempt_id": attempt.id}),
        "autoPlayAudio": attempt.test.auto_play_audio,
        "answers": existing_answers,
        "notes": existing_notes,
        "highlights": [
            {
                "client_id": item["client_id"],
                "selected_text": item["selected_text"],
                "context": item["context"],
                "color": item["color"],
                "created_at": item["created_at"].isoformat(),
            }
            for item in highlights
        ],
    }
    return render(
        request,
        "practice/platform/test_runner.html",
        {
            "attempt": attempt,
            "test": attempt.test,
            "runner_config_json": json.dumps(runner_config),
            "existing_answers": existing_answers,
            "existing_notes": existing_notes,
            "existing_highlights": highlights,
        },
    )


@login_required
@require_POST
def test_attempt_save(request, attempt_id):
    attempt = get_object_or_404(TestAttempt, id=attempt_id)
    _ensure_test_attempt_owner(request, attempt)
    if attempt.is_locked:
        return JsonResponse({"success": False, "error": "This section is locked."}, status=400)
    payload = _json_payload(request)
    answers = payload.get("answers", {})
    notes = payload.get("notes", [])
    highlights = payload.get("highlights", [])
    if not isinstance(answers, dict):
        return JsonResponse({"success": False, "error": "Answers must be a JSON object."}, status=400)
    if not isinstance(notes, list):
        return JsonResponse({"success": False, "error": "Notes must be a JSON array."}, status=400)
    if not isinstance(highlights, list):
        return JsonResponse({"success": False, "error": "Highlights must be a JSON array."}, status=400)
    attempt.answers = {str(key): value for key, value in answers.items()}
    attempt.notes = notes
    attempt.save(update_fields=["answers", "notes"])
    replace_highlights(attempt, highlights)
    return JsonResponse(
        {
            "success": True,
            "saved_answers": len(attempt.answers),
            "saved_notes": len(attempt.notes),
            "saved_highlights": len(highlights),
        }
    )


@login_required
@require_POST
def test_attempt_submit(request, attempt_id):
    attempt = get_object_or_404(TestAttempt, id=attempt_id)
    _ensure_test_attempt_owner(request, attempt)
    if attempt.is_locked:
        return JsonResponse({"success": True, "redirect_url": reverse("practice:test_result", kwargs={"attempt_id": attempt.id})})
    payload = _json_payload(request)
    answers = payload.get("answers", {})
    notes = payload.get("notes", [])
    highlights = payload.get("highlights", [])
    if not isinstance(answers, dict):
        return JsonResponse({"success": False, "error": "Answers must be a JSON object."}, status=400)
    if not isinstance(notes, list):
        return JsonResponse({"success": False, "error": "Notes must be a JSON array."}, status=400)
    if not isinstance(highlights, list):
        return JsonResponse({"success": False, "error": "Highlights must be a JSON array."}, status=400)
    replace_highlights(attempt, highlights)
    attempt.mark_submitted(
        answers={str(key): value for key, value in answers.items()},
        notes=notes,
        time_spent_seconds=payload.get("time_spent_seconds", 0),
    )
    return JsonResponse(
        {
            "success": True,
            "score": attempt.score,
            "total": attempt.total_questions,
            "redirect_url": reverse("practice:test_result", kwargs={"attempt_id": attempt.id}),
        }
    )


@login_required
@require_POST
def test_attempt_highlights_save(request, attempt_id):
    attempt = get_object_or_404(TestAttempt, id=attempt_id)
    _ensure_test_attempt_owner(request, attempt)
    if attempt.is_locked:
        return JsonResponse({"success": False, "error": "This section is locked."}, status=400)
    payload = _json_payload(request)
    highlights = payload.get("highlights", [])
    if not isinstance(highlights, list):
        return JsonResponse({"success": False, "error": "Highlights must be a JSON array."}, status=400)
    replace_highlights(attempt, highlights)
    return JsonResponse({"success": True, "saved_highlights": len(highlights)})


@login_required
def test_result(request, attempt_id):
    attempt = get_object_or_404(TestAttempt.objects.select_related("test", "user"), id=attempt_id)
    _ensure_test_attempt_owner(request, attempt)
    highlights = attempt.highlights.all()
    return render(request, "practice/platform/test_result.html", {"attempt": attempt, "highlights": highlights})


@login_required
def dictation_list(request):
    exercises = DictationExercise.objects.filter(is_published=True)
    return render(request, "practice/platform/dictation_list.html", {"exercises": exercises})


@login_required
def start_dictation(request, slug):
    exercise = get_object_or_404(DictationExercise, slug=slug, is_published=True)
    attempt = DictationAttempt.objects.create(user=request.user, exercise=exercise)
    return redirect("practice:dictation_runner", attempt_id=attempt.id)


@login_required
def dictation_runner(request, attempt_id):
    attempt = get_object_or_404(DictationAttempt.objects.select_related("exercise", "user"), id=attempt_id)
    _ensure_dictation_owner(request, attempt)
    if attempt.is_submitted:
        return redirect("practice:dictation_result", attempt_id=attempt.id)
    return render(request, "practice/platform/dictation_runner.html", {"attempt": attempt, "exercise": attempt.exercise})


@login_required
@require_POST
def dictation_submit(request, attempt_id):
    attempt = get_object_or_404(DictationAttempt.objects.select_related("exercise", "user"), id=attempt_id)
    _ensure_dictation_owner(request, attempt)
    attempt.mark_submitted(request.POST.get("submitted_text", ""))
    return redirect("practice:dictation_result", attempt_id=attempt.id)


@login_required
def dictation_result(request, attempt_id):
    attempt = get_object_or_404(DictationAttempt.objects.select_related("exercise", "user"), id=attempt_id)
    _ensure_dictation_owner(request, attempt)
    return render(request, "practice/platform/dictation_result.html", {"attempt": attempt})


@login_required
def article_list(request):
    articles = Article.objects.filter(is_published=True)
    return render(request, "practice/platform/article_list.html", {"articles": articles})


@login_required
def article_detail(request, slug):
    article = get_object_or_404(Article, slug=slug, is_published=True)
    return render(request, "practice/platform/article_detail.html", {"article": article})


@login_required
def podcast_list(request):
    podcasts = Test.objects.filter(skill=Test.Skill.PODCAST, is_published=True)
    return render(request, "practice/platform/podcast_list.html", {"podcasts": podcasts})


@login_required
def mock_list(request):
    mocks = FullMockTest.objects.filter(is_published=True)
    return render(request, "practice/platform/mock_list.html", {"mocks": mocks})


@login_required
def mock_detail(request, slug):
    mock = get_object_or_404(FullMockTest, slug=slug, is_published=True)
    component_tests = [mock.listening_test, mock.reading_test, mock.writing_test]
    latest_attempts = {}
    attempts = TestAttempt.objects.filter(user=request.user, test__in=component_tests).order_by("test_id", "-started_at")
    for attempt in attempts:
        latest_attempts.setdefault(attempt.test_id, attempt)
    sections = [{"test": test, "attempt": latest_attempts.get(test.id)} for test in component_tests]
    complete = all(item["attempt"] and item["attempt"].is_submitted for item in sections)
    total_score = sum((item["attempt"].score or 0) for item in sections if item["attempt"])
    total_questions = sum(test.answer_key and len(test.answer_key) or 0 for test in component_tests)
    return render(
        request,
        "practice/platform/mock_detail.html",
        {"mock": mock, "sections": sections, "complete": complete, "total_score": total_score, "total_questions": total_questions},
    )


@staff_member_required
def teacher_dashboard(request):
    tests = Test.objects.all().order_by("-updated_at")[:12]
    attempts = TestAttempt.objects.select_related("test", "user").order_by("-started_at")[:12]
    return render(
        request,
        "practice/teacher/dashboard.html",
        {
            "test_count": Test.objects.count(),
            "published_count": Test.objects.filter(is_published=True).count(),
            "attempt_count": TestAttempt.objects.count(),
            "tests": tests,
            "attempts": attempts,
        },
    )


@staff_member_required
def teacher_tests(request):
    tests = Test.objects.all().order_by("-updated_at")
    return render(request, "practice/teacher/test_table.html", {"tests": tests})


@staff_member_required
def teacher_test_create(request):
    return save_teacher_test(request, None)


@staff_member_required
def teacher_test_edit(request, pk):
    test = get_object_or_404(Test, pk=pk)
    return save_teacher_test(request, test)


@staff_member_required
def teacher_test_preview(request, pk):
    test = get_object_or_404(Test, pk=pk)
    return render(request, "practice/teacher/test_preview.html", {"test": test})


@staff_member_required
def teacher_test_delete(request, pk):
    test = get_object_or_404(Test, pk=pk)
    if request.method == "POST":
        test.delete()
        messages.success(request, "Test deleted.")
        return redirect("practice:teacher_tests")
    return render(request, "practice/teacher/confirm_delete.html", {"object": test, "cancel_url": reverse("practice:teacher_tests")})


@staff_member_required
def teacher_mock_create(request):
    mock = None
    form = FullMockTestForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        mock = form.save(commit=False)
        mock.created_by = request.user
        mock.save()
        messages.success(request, "Full mock test saved.")
        return redirect("practice:teacher_dashboard")
    return render(request, "practice/teacher/form.html", {"form": form, "title": "Create full mock test", "object": mock})


@staff_member_required
def teacher_article_create(request):
    form = ArticleForm(request.POST or None, request.FILES or None)
    if request.method == "POST" and form.is_valid():
        article = form.save(commit=False)
        article.created_by = request.user
        article.save()
        messages.success(request, "Article saved.")
        return redirect("practice:teacher_dashboard")
    return render(request, "practice/teacher/form.html", {"form": form, "title": "Create article", "object": None})


@staff_member_required
def teacher_dictation_create(request):
    form = DictationExerciseForm(request.POST or None, request.FILES or None)
    if request.method == "POST" and form.is_valid():
        exercise = form.save(commit=False)
        exercise.created_by = request.user
        exercise.save()
        messages.success(request, "Dictation exercise saved.")
        return redirect("practice:teacher_dashboard")
    return render(request, "practice/teacher/form.html", {"form": form, "title": "Create dictation", "object": None})


def save_teacher_test(request, test):
    form = TestForm(request.POST or None, request.FILES or None, instance=test)
    if request.method == "POST" and form.is_valid():
        saved = form.save(commit=False)
        if saved.created_by_id is None:
            saved.created_by = request.user
        saved.save()
        messages.success(request, "Test saved.")
        return redirect("practice:teacher_tests")
    return render(request, "practice/teacher/form.html", {"form": form, "title": "Edit test" if test else "Create test", "object": test})


def replace_highlights(attempt, highlights):
    attempt.highlights.all().delete()
    Highlight.objects.bulk_create(
        [
            Highlight(
                attempt=attempt,
                selected_text=str(item.get("text") or item.get("selected_text") or "")[:5000],
                context=str(item.get("context") or "")[:5000],
                color=str(item.get("color") or "yellow")[:24],
                client_id=str(item.get("id") or item.get("client_id") or "")[:80],
            )
            for item in highlights
            if isinstance(item, dict) and (item.get("text") or item.get("selected_text"))
        ]
    )


def _ensure_test_attempt_owner(request, attempt):
    if attempt.user_id != request.user.id:
        raise PermissionDenied("You can only access your own attempts.")


def _ensure_dictation_owner(request, attempt):
    if attempt.user_id != request.user.id:
        raise PermissionDenied("You can only access your own dictation attempts.")
