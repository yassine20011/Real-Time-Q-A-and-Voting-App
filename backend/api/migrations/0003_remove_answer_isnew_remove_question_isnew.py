# Generated by Django 4.2.4 on 2023-10-07 01:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_answer_isnew_question_isnew'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='answer',
            name='isNew',
        ),
        migrations.RemoveField(
            model_name='question',
            name='isNew',
        ),
    ]