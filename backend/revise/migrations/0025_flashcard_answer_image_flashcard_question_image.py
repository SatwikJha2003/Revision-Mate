# Generated by Django 5.0.6 on 2024-07-12 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0024_rename_comments_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='flashcard',
            name='answer_image',
            field=models.TextField(default=''),
        ),
        migrations.AddField(
            model_name='flashcard',
            name='question_image',
            field=models.TextField(default=''),
        ),
    ]