# Generated by Django 5.0.6 on 2024-07-18 10:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0032_confidence_count_alter_confidence_confidence_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='history',
            name='confidence',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=3),
            preserve_default=False,
        ),
    ]