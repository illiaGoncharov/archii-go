// Сервис для работы с Wikidata API
// Получение описаний и ссылок по Q-ID архитектурных элементов

import { WikidataInfo } from '../types/detection';

const WIKIDATA_API = 'https://www.wikidata.org/w/api.php';

interface WikidataEntity {
  labels?: Record<string, { value: string }>;
  descriptions?: Record<string, { value: string }>;
  sitelinks?: Record<string, { title: string; url: string }>;
  claims?: Record<string, Array<{
    mainsnak?: {
      datavalue?: {
        value?: string | { id?: string };
      };
    };
  }>>;
}

interface WikidataResponse {
  entities: Record<string, WikidataEntity>;
}

/**
 * Получить информацию об элементе из Wikidata по Q-ID
 */
export const fetchWikidataInfo = async (qid: string): Promise<WikidataInfo | null> => {
  try {
    const params = new URLSearchParams({
      action: 'wbgetentities',
      ids: qid,
      props: 'labels|descriptions|sitelinks|claims',
      languages: 'ru|en',
      format: 'json',
      origin: '*'
    });

    const response = await fetch(`${WIKIDATA_API}?${params}`);
    
    if (!response.ok) {
      throw new Error(`Wikidata API error: ${response.status}`);
    }

    const data: WikidataResponse = await response.json();
    const entity = data.entities[qid];

    if (!entity) {
      console.warn(`Entity ${qid} not found in Wikidata`);
      return null;
    }

    // Извлекаем название
    const nameRu = entity.labels?.ru?.value || entity.labels?.en?.value || qid;
    const nameEn = entity.labels?.en?.value;

    // Извлекаем описание
    const descriptionRu = entity.descriptions?.ru?.value || 
                          entity.descriptions?.en?.value || 
                          'Описание отсутствует';
    const descriptionEn = entity.descriptions?.en?.value;

    // Ссылка на русскую Википедию
    const wikipediaUrl = entity.sitelinks?.ruwiki?.url || 
                         entity.sitelinks?.enwiki?.url;

    // Ссылка на Wikidata
    const wikidataUrl = `https://www.wikidata.org/wiki/${qid}`;

    // Изображение (P18 — свойство "изображение")
    let imageUrl: string | undefined;
    const imageClaim = entity.claims?.P18?.[0];
    if (imageClaim?.mainsnak?.datavalue?.value) {
      const imageName = imageClaim.mainsnak.datavalue.value as string;
      // Формируем URL изображения из Wikimedia Commons
      imageUrl = getCommonsImageUrl(imageName);
    }

    return {
      qid,
      nameRu,
      nameEn,
      descriptionRu,
      descriptionEn,
      wikipediaUrl,
      wikidataUrl,
      imageUrl
    };
  } catch (error) {
    console.error('Ошибка загрузки данных из Wikidata:', error);
    return null;
  }
};

/**
 * Формирует URL изображения из Wikimedia Commons
 * Wikimedia использует MD5-хэш для пути к файлу
 */
const getCommonsImageUrl = (filename: string, width = 400): string => {
  // Заменяем пробелы на подчёркивания
  const normalizedName = filename.replace(/ /g, '_');
  
  // Формируем URL через Special:FilePath (проще, чем MD5)
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(normalizedName)}?width=${width}`;
};

/**
 * Batch-запрос для нескольких Q-ID (оптимизация)
 */
export const fetchMultipleWikidataInfo = async (
  qids: string[]
): Promise<Map<string, WikidataInfo>> => {
  const results = new Map<string, WikidataInfo>();
  
  if (qids.length === 0) return results;

  try {
    const params = new URLSearchParams({
      action: 'wbgetentities',
      ids: qids.join('|'),
      props: 'labels|descriptions|sitelinks',
      languages: 'ru|en',
      format: 'json',
      origin: '*'
    });

    const response = await fetch(`${WIKIDATA_API}?${params}`);
    const data: WikidataResponse = await response.json();

    for (const qid of qids) {
      const entity = data.entities[qid];
      if (entity) {
        const info: WikidataInfo = {
          qid,
          nameRu: entity.labels?.ru?.value || entity.labels?.en?.value || qid,
          nameEn: entity.labels?.en?.value,
          descriptionRu: entity.descriptions?.ru?.value || 'Описание отсутствует',
          descriptionEn: entity.descriptions?.en?.value,
          wikipediaUrl: entity.sitelinks?.ruwiki?.url,
          wikidataUrl: `https://www.wikidata.org/wiki/${qid}`
        };
        results.set(qid, info);
      }
    }
  } catch (error) {
    console.error('Ошибка batch-загрузки из Wikidata:', error);
  }

  return results;
};

/**
 * SPARQL-запрос для получения примеров зданий с элементом
 * (для будущего расширения)
 */
export const fetchBuildingsWithElement = async (qid: string): Promise<string[]> => {
  const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';
  
  const query = `
    SELECT ?building ?buildingLabel WHERE {
      ?building wdt:P31/wdt:P279* wd:Q41176 .  # Экземпляр здания
      ?building wdt:P527 wd:${qid} .           # Имеет часть = элемент
      SERVICE wikibase:label { bd:serviceParam wikibase:language "ru,en". }
    }
    LIMIT 10
  `;

  try {
    const response = await fetch(SPARQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: `query=${encodeURIComponent(query)}`
    });

    const data = await response.json();
    return data.results.bindings.map((b: { buildingLabel: { value: string } }) => 
      b.buildingLabel.value
    );
  } catch (error) {
    console.error('Ошибка SPARQL-запроса:', error);
    return [];
  }
};
