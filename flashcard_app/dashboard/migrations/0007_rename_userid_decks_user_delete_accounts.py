# Generated by Django 4.2.2 on 2023-07-20 07:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0006_alter_decks_userid'),
    ]

    operations = [
        migrations.RenameField(
            model_name='decks',
            old_name='UserID',
            new_name='user',
        ),
        migrations.DeleteModel(
            name='Accounts',
        ),
    ]
