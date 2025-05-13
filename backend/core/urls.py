from django.urls import path
from core.api.masterdata import MasterdataMeta, MasterdataFull, MasterdataData, MasterdataItem
from core.api.gpt_api import chat_with_gpt

urlpatterns = [
    path('<str:code>/meta/', MasterdataMeta.as_view()),
    path('<str:code>/full/', MasterdataFull.as_view()),
    path('<str:code>/<int:id>/', MasterdataItem.as_view()),
    path('<str:code>/', MasterdataData.as_view()),

    path('chat/', chat_with_gpt),
]