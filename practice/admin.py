from django.contrib import admin

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


@admin.register(PracticeTask)
class PracticeTaskAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "test_type",
        "section_number",
        "duration_minutes",
        "is_active",
        "updated_at",
    )
    list_filter = ("test_type", "section_number", "is_active")
    search_fields = ("title", "slug", "html_content")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Task", {"fields": ("title", "slug", "test_type", "section_number", "duration_minutes", "is_active")}),
        (
            "Content",
            {
                "description": (
                    "Only paste HTML from trusted staff. The platform renders this content as safe HTML "
                    "for students, so external scripts and risky markup are blocked by model validation."
                ),
                "fields": ("html_content", "answer_key"),
            },
        ),
        ("Dates", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(PracticeAttempt)
class PracticeAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "task",
        "score",
        "time_spent_seconds",
        "is_submitted",
        "started_at",
        "submitted_at",
    )
    list_filter = ("is_submitted", "task__test_type", "task")
    search_fields = ("user__username", "user__email", "task__title")
    readonly_fields = ("user", "task", "started_at", "submitted_at")
    fieldsets = (
        ("Attempt", {"fields": ("user", "task", "is_submitted", "score", "time_spent_seconds")}),
        ("Student work", {"fields": ("answers", "highlights", "notes")}),
        ("Dates", {"fields": ("started_at", "submitted_at")}),
    )
    date_hierarchy = "started_at"


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = ("title", "skill", "section_type", "duration_minutes", "is_published", "updated_at")
    list_filter = ("skill", "section_type", "is_published", "allow_highlighting", "auto_play_audio")
    search_fields = ("title", "slug", "html_content")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Test", {"fields": ("title", "slug", "skill", "section_type", "duration_minutes", "is_published")}),
        ("Content", {"fields": ("html_content", "audio_file", "answer_key")}),
        ("Options", {"fields": ("allow_highlighting", "auto_play_audio", "mobile_optimized", "created_by")}),
        ("Dates", {"fields": ("created_at", "updated_at")}),
    )


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "test", "score", "is_submitted", "is_locked", "started_at", "submitted_at")
    list_filter = ("is_submitted", "is_locked", "test__skill", "test__section_type")
    search_fields = ("user__username", "test__title")
    readonly_fields = ("started_at", "submitted_at")


@admin.register(Highlight)
class HighlightAdmin(admin.ModelAdmin):
    list_display = ("id", "attempt", "color", "created_at")
    search_fields = ("selected_text", "attempt__user__username", "attempt__test__title")
    readonly_fields = ("created_at",)


@admin.register(DictationExercise)
class DictationExerciseAdmin(admin.ModelAdmin):
    list_display = ("title", "duration_minutes", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "slug", "transcript")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")


@admin.register(DictationAttempt)
class DictationAttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "exercise", "accuracy_percent", "is_submitted", "started_at", "submitted_at")
    list_filter = ("is_submitted",)
    search_fields = ("user__username", "exercise__title", "submitted_text")
    readonly_fields = ("started_at", "submitted_at")


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "allow_highlighting", "is_published", "updated_at")
    list_filter = ("is_published", "allow_highlighting")
    search_fields = ("title", "slug", "html_content")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")


@admin.register(FullMockTest)
class FullMockTestAdmin(admin.ModelAdmin):
    list_display = ("title", "listening_test", "reading_test", "writing_test", "is_published", "updated_at")
    list_filter = ("is_published",)
    search_fields = ("title", "slug")
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ("created_at", "updated_at")
