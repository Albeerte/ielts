from django.urls import path

from . import views


app_name = "practice"

urlpatterns = [
    path("", views.test_list, name="test_list"),
    path("t/<slug:slug>/", views.test_detail, name="test_detail"),
    path("t/<slug:slug>/start/", views.start_test_attempt, name="start_test_attempt"),
    path("attempt/<int:attempt_id>/", views.test_runner, name="test_runner"),
    path("attempt/<int:attempt_id>/save/", views.test_attempt_save, name="test_attempt_save"),
    path("attempt/<int:attempt_id>/submit/", views.test_attempt_submit, name="test_attempt_submit"),
    path("attempt/<int:attempt_id>/highlights/save/", views.test_attempt_highlights_save, name="test_attempt_highlights_save"),
    path("attempt/<int:attempt_id>/result/", views.test_result, name="test_result"),
    path("dictation/", views.dictation_list, name="dictation_list"),
    path("dictation/<slug:slug>/start/", views.start_dictation, name="start_dictation"),
    path("dictation/attempt/<int:attempt_id>/", views.dictation_runner, name="dictation_runner"),
    path("dictation/attempt/<int:attempt_id>/submit/", views.dictation_submit, name="dictation_submit"),
    path("dictation/attempt/<int:attempt_id>/result/", views.dictation_result, name="dictation_result"),
    path("articles/", views.article_list, name="article_list"),
    path("articles/<slug:slug>/", views.article_detail, name="article_detail"),
    path("podcasts/", views.podcast_list, name="podcast_list"),
    path("mocks/", views.mock_list, name="mock_list"),
    path("mocks/<slug:slug>/", views.mock_detail, name="mock_detail"),
    path("teacher/", views.teacher_dashboard, name="teacher_dashboard"),
    path("teacher/tests/", views.teacher_tests, name="teacher_tests"),
    path("teacher/tests/create/", views.teacher_test_create, name="teacher_test_create"),
    path("teacher/tests/<int:pk>/edit/", views.teacher_test_edit, name="teacher_test_edit"),
    path("teacher/tests/<int:pk>/preview/", views.teacher_test_preview, name="teacher_test_preview"),
    path("teacher/tests/<int:pk>/delete/", views.teacher_test_delete, name="teacher_test_delete"),
    path("teacher/articles/create/", views.teacher_article_create, name="teacher_article_create"),
    path("teacher/dictation/create/", views.teacher_dictation_create, name="teacher_dictation_create"),
    path("teacher/mocks/create/", views.teacher_mock_create, name="teacher_mock_create"),
    path("legacy/", views.task_list, name="task_list"),
    path("legacy/<slug:slug>/", views.task_detail, name="task_detail"),
    path("legacy/<slug:slug>/start/", views.start_attempt, name="start_attempt"),
    path("legacy/attempt/<int:attempt_id>/save/", views.save_attempt, name="save_attempt"),
    path("legacy/attempt/<int:attempt_id>/submit/", views.submit_attempt, name="submit_attempt"),
    path("legacy/attempt/<int:attempt_id>/result/", views.result, name="result"),
]
