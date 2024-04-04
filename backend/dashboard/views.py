from django.http import JsonResponse

from ArtFloyd.xata import xata
from artwork.views import protected
from collections import defaultdict
from datetime import datetime

@protected
def analytics(request, user):
    records = xata.data().query("artwork", {
        "columns": ["name", "artist", "price"],
        "filter": { "artist.id": user["id"] }
    })["records"]

    chartdata = []
    for item in records:
        date = datetime.fromisoformat(item['xata']['createdAt']).strftime('%Y-%m-%d')
        name = item['name'] if item['name'] else ""
        chartdata.append({
            "date": date,
            name: item['price']
        })

    grouped = defaultdict(list)
    for item in chartdata:
        grouped[item['date']].append(item)

    result = []
    for date, items in grouped.items():
        combined_item = {"date": date}
        for item in items:
            combined_item.update({k: v for k, v in item.items() if k != "date"})
        result.append(combined_item)

    return JsonResponse(result, safe=False)

