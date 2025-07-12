def count_high_words(text):
    high_words = [
        'fire', 'gas leak', 'explosion', 'hazard', 'collapsed', 'collapse',
        'water main break', 'electrical', 'injury', 'injuries', 'accident',
        'sinkhole', 'critical', 'dangerous', 'danger', 'urgent',
        'emergency', 'fatal', 'power outage', 'live wire',
        'severe flooding', 'trapped', 'serious', 'risk', 'life threatening',
        'multiple injuries', 'deadly', 'major'
    ]
    text = text.lower()
    return sum(1 for word in high_words if word in text)
