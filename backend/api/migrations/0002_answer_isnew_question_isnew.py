# Generated by Django 4.2.4 on 2023-10-07 01:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='answer',
            name='isNew',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='question',
            name='isNew',
            field=models.BooleanField(default=False),
        ),
    ]
