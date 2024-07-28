# Generated by Django 5.0.6 on 2024-07-07 13:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0010_rename_public_deck_share'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='flashcard',
            name='deck',
        ),
        migrations.AddField(
            model_name='flashcard',
            name='deck',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='revise.deck'),
        ),
    ]
