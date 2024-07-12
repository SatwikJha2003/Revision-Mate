# Generated by Django 5.0.6 on 2024-07-12 12:02

import revise.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0026_alter_flashcard_answer_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flashcard',
            name='answer_image',
            field=models.ImageField(null=True, upload_to=revise.models.set_image_path),
        ),
        migrations.AlterField(
            model_name='flashcard',
            name='question_image',
            field=models.ImageField(null=True, upload_to=revise.models.set_image_path),
        ),
    ]
