from django.urls import path
from core.api.masterdata import MasterdataMeta, MasterdataFull, MasterdataData, MasterdataItem
from core.api.gpt_api import chat_with_gpt
from core.api.choices import ChoiceListView

urlpatterns = [
    path('<str:code>/meta/', MasterdataMeta.as_view()),
    path('<str:code>/full/', MasterdataFull.as_view()),
    path('<str:code>/<int:id>/', MasterdataItem.as_view()),
    path('<str:code>/', MasterdataData.as_view()),
    path("choices/<str:code>/", ChoiceListView.as_view()),
    path('chat/', chat_with_gpt),
]