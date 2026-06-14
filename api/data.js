import { readStore, aggregateRatings, json } from './_store.js';

// Public read: approved community games + rating aggregates.
export default async function handler(req, res) {
  try {
    const { data } = await readStore();
    json(res, 200, {
      published: data.published || [],
      ratings: aggregateRatings(data.ratings),
    });
  } catch (e) {
    // Degrade gracefully so the static hub still works if the store is down.
    json(res, 200, { published: [], ratings: {}, error: 'store_unavailable' });
  }
}
