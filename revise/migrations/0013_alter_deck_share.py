# Generated by Django 5.0.6 on 2024-07-08 09:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0012_remove_deck_owner_decks'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deck',
            name='share',
            field=models.CharField(default='false', max_length=20),
        ),
    ]
