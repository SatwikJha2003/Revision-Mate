# Generated by Django 5.0.6 on 2024-07-18 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('revise', '0031_friends_friends'),
    ]

    operations = [
        migrations.AddField(
            model_name='confidence',
            name='count',
            field=models.IntegerField(default=1),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='confidence',
            name='confidence',
            field=models.DecimalField(decimal_places=2, max_digits=3),
        ),
        migrations.AddConstraint(
            model_name='confidence',
            constraint=models.UniqueConstraint(fields=('user', 'flashcard'), name='user confidence'),
        ),
    ]
