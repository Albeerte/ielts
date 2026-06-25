# Generated manually for the IELTS practice platform.
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PracticeTask",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("title", models.CharField(max_length=255)),
                ("slug", models.SlugField(blank=True, max_length=255, unique=True)),
                (
                    "test_type",
                    models.CharField(
                        choices=[
                            ("reading", "Reading"),
                            ("listening", "Listening"),
                            ("writing", "Writing"),
                            ("speaking", "Speaking"),
                        ],
                        max_length=20,
                    ),
                ),
                ("section_number", models.PositiveSmallIntegerField(default=1)),
                ("duration_minutes", models.PositiveSmallIntegerField(default=60)),
                (
                    "html_content",
                    models.TextField(
                        help_text=(
                            "Paste trusted, self-contained task HTML. Inline CSS/JS is allowed; "
                            "external scripts, iframes, and inline event attributes are rejected."
                        )
                    ),
                ),
                ("answer_key", models.JSONField(blank=True, default=dict)),
                ("is_active", models.BooleanField(default=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["test_type", "section_number", "title"],
            },
        ),
        migrations.CreateModel(
            name="PracticeAttempt",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("answers", models.JSONField(blank=True, default=dict)),
                ("score", models.PositiveIntegerField(blank=True, null=True)),
                ("started_at", models.DateTimeField(auto_now_add=True)),
                ("submitted_at", models.DateTimeField(blank=True, null=True)),
                ("time_spent_seconds", models.PositiveIntegerField(default=0)),
                ("is_submitted", models.BooleanField(default=False)),
                (
                    "task",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="attempts",
                        to="practice.practicetask",
                    ),
                ),
                (
                    "user",
                    models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
                ),
            ],
            options={
                "ordering": ["-started_at"],
            },
        ),
        migrations.AddIndex(
            model_name="practiceattempt",
            index=models.Index(fields=["user", "task", "is_submitted"], name="practice_pr_user_id_23cd3e_idx"),
        ),
        migrations.AddIndex(
            model_name="practiceattempt",
            index=models.Index(fields=["submitted_at"], name="practice_pr_submitt_1857dc_idx"),
        ),
    ]
