from django import forms

from .models import Article, DictationExercise, FullMockTest, Test


class HtmlUploadMixin:
    html_file = forms.FileField(
        required=False,
        help_text="Optional .html file. If provided, it replaces the pasted HTML content.",
    )

    def clean(self):
        cleaned_data = super().clean()
        html_file = cleaned_data.get("html_file")
        if html_file:
            if not html_file.name.lower().endswith((".html", ".htm", ".txt")):
                raise forms.ValidationError("Upload an .html, .htm, or .txt file.")
            cleaned_data["html_content"] = html_file.read().decode("utf-8", errors="replace")
        return cleaned_data


class TestForm(HtmlUploadMixin, forms.ModelForm):
    class Meta:
        model = Test
        fields = [
            "title",
            "slug",
            "skill",
            "section_type",
            "html_content",
            "audio_file",
            "answer_key",
            "duration_minutes",
            "allow_highlighting",
            "auto_play_audio",
            "mobile_optimized",
            "is_published",
        ]
        widgets = {
            "html_content": forms.Textarea(attrs={"rows": 16, "class": "code-field"}),
            "answer_key": forms.Textarea(attrs={"rows": 10, "class": "code-field"}),
        }


class ArticleForm(HtmlUploadMixin, forms.ModelForm):
    class Meta:
        model = Article
        fields = [
            "title",
            "slug",
            "html_content",
            "audio_file",
            "vocabulary",
            "allow_highlighting",
            "is_published",
        ]
        widgets = {
            "html_content": forms.Textarea(attrs={"rows": 16, "class": "code-field"}),
            "vocabulary": forms.Textarea(attrs={"rows": 8, "class": "code-field"}),
        }


class DictationExerciseForm(forms.ModelForm):
    class Meta:
        model = DictationExercise
        fields = [
            "title",
            "slug",
            "audio_file",
            "transcript",
            "html_content",
            "duration_minutes",
            "is_published",
        ]
        widgets = {
            "transcript": forms.Textarea(attrs={"rows": 8}),
            "html_content": forms.Textarea(attrs={"rows": 10, "class": "code-field"}),
        }


class FullMockTestForm(forms.ModelForm):
    class Meta:
        model = FullMockTest
        fields = ["title", "slug", "listening_test", "reading_test", "writing_test", "is_published"]
