const { MongoClient } = require('mongodb');

async function seed() {
    const client = new MongoClient('mongodb://localhost:27017');
    await client.connect();
    const db = client.db('recodb');
    
    // Clear existing
    await db.collection('items').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('interactions').deleteMany({});
    
    // Insert movies
    await db.collection('items').insertMany([
        { itemId: 'i1', title: 'Iron Man', tags: ['action', 'superhero'] },
        { itemId: 'i2', title: 'Thor', tags: ['action', 'fantasy'] },
        { itemId: 'i3', title: 'Inception', tags: ['sci-fi', 'thriller'] },
        { itemId: 'i4', title: 'Interstellar', tags: ['space', 'drama'] },
        { itemId: 'i5', title: 'Avatar', tags: ['fantasy', 'adventure'] }
    ]);
    
    // Insert users
    await db.collection('users').insertMany([
        { userId: 'u1', name: 'Alice' },
        { userId: 'u2', name: 'Bob' }
    ]);
    
    // Insert interactions
    await db.collection('interactions').insertMany([
        { userId: 'u1', itemId: 'i1', type: 'view' },
        { userId: 'u1', itemId: 'i3', type: 'purchase' },
        { userId: 'u2', itemId: 'i2', type: 'view' }
    ]);
    
    console.log('✓ Database seeded successfully');
    await client.close();
}

seed().catch(console.error);
