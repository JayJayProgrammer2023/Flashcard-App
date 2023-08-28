# Generated by Django 4.2.2 on 2023-08-06 00:59

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dashboard', '0012_alter_decks_deckid'),
    ]

    operations = [
        migrations.CreateModel(
            name='Cards',
            fields=[
                ('CardID', models.AutoField(primary_key=True, serialize=False)),
                ('CardFront', models.TextField()),
                ('CardBack', models.TextField()),
                ('DeckID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.decks')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]