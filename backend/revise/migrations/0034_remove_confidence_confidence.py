# Generated by Django 5.0.6 on 2024-07-18 10:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0033_history_confidence'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='confidence',
            name='confidence',
        ),
    ]
