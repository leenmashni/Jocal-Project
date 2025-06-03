const mongoose = require('mongoose');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');
const Product = require(path.join(__dirname, '../Models/Product'));
const User = require(path.join(__dirname, '../Models/users'));
const sendEmail = require('./emailnotify');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const websites = [
    // Famekey
    ['https://famekey.com/products.json', 'famekey.com'],
    ['https://famekey.com/collections/sale/products.json', 'famekey.com'],
    
    // Pure Home Decor
    ['https://pure-homedecor.com/products.json', 'pure-homedecor.com'],
    
    // Zaya
    ['https://theofficialzaya.com/products.json', 'theofficialzaya.com'],
    
    // Joy Jewels
    ['https://www.thejoyjewels.com/products.json', 'www.thejoyjewels.com'],
    
    // Amina Skincare
    ['https://global.aminaskincare.com/products.json', 'global.aminaskincare.com'],
    
    // FNL Clothing
    ['https://fnlclothing.com/products.json', 'fnlclothing.com'],
    
    // Jobedu
    ['https://jobedu.com/products.json', 'jobedu.com'],
    
    // Watan Palestine - Main collections
    ['https://watanpalestine.com/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/stickers/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/necklaces/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/bracelets/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/earrings/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/rings/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/home-decor/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/kitchen/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/pillows/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/seasonal/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/prints/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/poster/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/wall-decor/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/tatreez-kits-accessories/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/scarves/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/shirts/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/outerwear/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/pins/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/tote-bags/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/phonecases/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/keychains/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/cards/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/washi-tape/products.json', 'watanpalestine.com'],
    ['https://watanpalestine.com/collections/books/products.json', 'watanpalestine.com'],
    
    // Alaseel
    ['https://alaseelbrand.com/products.json', 'alaseelbrand.com'],
    
    // August Shoes
    ['https://august-shoes.com/products.json', 'august-shoes.com'],
    
    // Fair and Care
    ['https://www.fairandcare.store/products.json', 'www.fairandcare.store'],
    
    // Sealed
    ['https://sealedjo.com/products.json', 'sealedjo.com']
];

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('MongoDB connection error', 'ERROR');
        process.exit(1);
    }
}

function getProductImage(product) {
    if (product.featured_image) return product.featured_image;
    if (product.images && product.images.length > 0) {
        if (typeof product.images[0] === 'object') return product.images[0].src || '';
        return product.images[0];
    }
    if (product.variants && product.variants.length > 0 && product.variants[0].featured_image) {
        return product.variants[0].featured_image.src || '';
    }
    return '';
}

function processProduct(product, source, baseUrl) {
    if (!product.title || !product.handle) return null;

    const title = product.title.trim();
    const urlHandle = product.handle.trim();
    const productUrl = `https://${source}/products/${urlHandle}`;
    const imageUrl = getProductImage(product);

    // Define allowed categories and subcategories
    const allowedCategories = {
        'Jewelry': ['Necklaces', 'Bracelets', 'Earrings', 'Rings'],
        'Clothing': ['Shirts', 'Pants', 'Dresses', 'Hoodie', 'Shoes'],
        'Accessories': ['Pins', 'Bags', 'Phonecases', 'Keychains', 'Stickers', 'Caps'],
        'Cosmetics': ['Shower oils', 'Oil', 'Deadsea salts', 'Cream', 'Soap'],
        'Home': ['Vase', 'Tray', 'Pillows', 'Wall-decor'],
        'Art': ['Prints', 'Poster', 'Cards', 'Washi-tape'],
        'Books': ['Books']
    };

    // Mapping for variations of subcategory names
    const subcategoryMapping = {
        'necklace': 'Necklaces', 'diamond necklace': 'Necklaces', 'engravable necklaces': 'Necklaces',
        'bracelet': 'Bracelets', 'diamond bracelet': 'Bracelets', 'hand chains': 'Bracelets',
        'earring': 'Earrings', 'diamond earrings': 'Earrings', 'hoops': 'Earrings', 'studs': 'Earrings',
        'ring': 'Rings', 'diamond ring': 'Rings',
        'shirt': 'Shirts', 'tshirt': 'Shirts', 'top': 'Shirts', 'blouse': 'Shirts',
        'pant': 'Pants', 'leggings': 'Pants', 'short': 'Pants',
        'dress': 'Dresses', 'jumpsuit': 'Dresses', 'romper': 'Dresses',
        'hoodie': 'Hoodie', 'sweatshirt': 'Hoodie',
        'shoe': 'Shoes', 'augustshoes': 'Shoes',
        'pin': 'Pins',
        'bag': 'Bags', 'tote': 'Bags',
        'phonecase': 'Phonecases', 'phone case': 'Phonecases',
        'keychain': 'Keychains',
        'sticker': 'Stickers',
        'cap': 'Caps', 'hat': 'Caps',
        'shower oil': 'Shower oils',
        'oil': 'Oil', 'essential oil': 'Oil',
        'salt': 'Deadsea salts', 'deadsea': 'Deadsea salts',
        'cream': 'Cream', 'lotion': 'Cream',
        'soap': 'Soap',
        'vase': 'Vase',
        'tray': 'Tray',
        'pillow': 'Pillows',
        'wall': 'Wall-decor', 'decor': 'Wall-decor',
        'print': 'Prints',
        'poster': 'Poster',
        'card': 'Cards', 'gift card': 'Cards',
        'washi': 'Washi-tape',
        'book': 'Books'
    };

    // Determine category and subcategory
    let category = '';
    let subcategory = '';

    // Try to extract from collection URL
    if (baseUrl.includes('/collections/')) {
        const urlParts = baseUrl.split('/');
        const collectionIndex = urlParts.indexOf('collections');
        if (collectionIndex !== -1 && urlParts.length > collectionIndex + 1) {
            const collectionName = urlParts[collectionIndex + 1].toLowerCase();
            
            // Check if collection name matches any subcategory
            for (const [key, value] of Object.entries(subcategoryMapping)) {
                if (collectionName.includes(key.toLowerCase())) {
                    subcategory = value;
                    // Find which category this subcategory belongs to
                    for (const [cat, subs] of Object.entries(allowedCategories)) {
                        if (subs.includes(subcategory)) {
                            category = cat;
                            break;
                        }
                    }
                    break;
                }
            }
        }
    }

    // If no category/subcategory found, try product_type
    if (!category && product.product_type) {
        const productType = product.product_type.toLowerCase();
        
        for (const [key, value] of Object.entries(subcategoryMapping)) {
            if (productType.includes(key.toLowerCase())) {
                subcategory = value;
                // Find which category this subcategory belongs to
                for (const [cat, subs] of Object.entries(allowedCategories)) {
                    if (subs.includes(subcategory)) {
                        category = cat;
                        break;
                    }
                }
                break;
            }
        }
    }

    // If still no category, try product title
    if (!category && title) {
        const lowerTitle = title.toLowerCase();
        
        for (const [key, value] of Object.entries(subcategoryMapping)) {
            if (lowerTitle.includes(key.toLowerCase())) {
                subcategory = value;
                // Find which category this subcategory belongs to
                for (const [cat, subs] of Object.entries(allowedCategories)) {
                    if (subs.includes(subcategory)) {
                        category = cat;
                        break;
                    }
                }
                break;
            }
        }
    }

    // If we still don't have a valid category and subcategory, skip this product
    // This will cause it to be deleted later since it won't be in processedUrls
    if (!Object.keys(allowedCategories).includes(category)) {
        console.log(`SKIPPING: ${title} - Does not match category structure`);
        return null;
    }

    // Process variants
    const variants = product.variants || [];
    if (variants.length === 0) return null;

    let price = null;
    let compareAtPrice = null;

    for (const variant of variants) {
        if (variant.available) {
            price = parseFloat(variant.price) || 0;
            compareAtPrice = parseFloat(variant.compare_at_price) || 0;
            break;
        }
    }

    if (price === null) {
        return null;
    }

    const isOnSale = compareAtPrice > price;
    const originalPrice = isOnSale ? compareAtPrice : price;

    return {
        title,
        url: productUrl,
        price,
        original_price: originalPrice,
        on_sale: isOnSale,
        image: imageUrl,
        description: product.body_html || '',
        brand: product.vendor || '',
        category,
        subcategory,
        source,
        avg_rating: 0,
    };
}

async function notifyWishlistUsers(productId, productData) {
    try {
        // Find users who have this product in their wishlist
        const users = await User.find({ 'wishlist': { $elemMatch: { productId: productId.toString() } } });

        for (const user of users) {
            if (!user.email) continue;

            const subject = `New Sale Alert: ${productData.title}`;
            const body = `
Hello ${user.username || 'Valued Customer'},

An item in your wishlist is now on sale!

${productData.title}
Original Price: ${productData.original_price} JOD
Sale Price: ${productData.price} JOD
You Save: ${(((productData.original_price - productData.price) / productData.original_price) * 100).toFixed(2)}%

View it here: ${productData.url}

Best regards,  
Jocal
`;

            await sendEmail(user.email, subject, body);
        }
    } catch (error) {
        console.log(`Error notifying users: ${error.message}`);
    }
}

async function updateProducts() {
    await connectDB();

    // Initialize counters
    const stats = {
        total: { updated: 0, added: 0, deleted: 0 },
        bySource: {}
    };

    // Get all existing product URLs for deletion tracking
    const existingUrls = new Set();
    const allExistingProducts = await Product.find({}, { url: 1, source: 1 });
    allExistingProducts.forEach(product => {
        existingUrls.add(product.url);
        // Initialize source stats
        if (!stats.bySource[product.source]) {
            stats.bySource[product.source] = { updated: 0, added: 0, deleted: 0 };
        }
    });

    // Track processed URLs to identify deleted products later
    const processedUrls = new Set();

    for (const [baseUrl, source] of websites) {
        try {
            // Initialize source stats if not already done
            if (!stats.bySource[source]) {
                stats.bySource[source] = { updated: 0, added: 0, deleted: 0 };
            }

            console.log(`Processing products from ${source} (${baseUrl})...`);

            // Fetch multiple pages (up to 5 pages)
            let page = 1;
            let totalProducts = 0;
            let hasMoreProducts = true;

            while (hasMoreProducts && page <= 5) {
                const url = baseUrl.includes('?') ?
                    `${baseUrl}&page=${page}&limit=250` :
                    `${baseUrl}?page=${page}&limit=250`;

                console.log(`Fetching page ${page} from ${source}...`);
                const response = await axios.get(url);
                const products = response.data.products || [];

                if (products.length === 0) {
                    hasMoreProducts = false;
                    continue;
                }

                console.log(`Found ${products.length} products from ${source} (page ${page})`);
                totalProducts += products.length;

                for (const product of products) {
                    const processedProduct = processProduct(product, source, baseUrl);
                    
                    // If product doesn't match our category structure, don't add to processedUrls
                    // This will cause it to be deleted later
                    if (!processedProduct) {
                        continue;
                    }

                    processedUrls.add(processedProduct.url);
                    const existingProduct = await Product.findOne({ url: processedProduct.url });

                    if (existingProduct) {
                        // Check if product is newly on sale
                        const wasOnSale = existingProduct.on_sale;
                        const isNowOnSale = processedProduct.on_sale;

                        // Check if anything important has changed
                        const hasChanged =
                            existingProduct.price !== processedProduct.price ||
                            existingProduct.original_price !== processedProduct.original_price ||
                            existingProduct.on_sale !== processedProduct.on_sale ||
                            existingProduct.title !== processedProduct.title ||
                            existingProduct.category !== processedProduct.category ||
                            existingProduct.subcategory !== processedProduct.subcategory;

                        if (hasChanged) {
                            // Ensure category and subcategory are explicitly set
                            const updateData = {
                                ...processedProduct,
                                category: processedProduct.category || existingProduct.category || '',
                                subcategory: processedProduct.subcategory || existingProduct.subcategory || ''
                            };
                            
                            await Product.updateOne({ url: processedProduct.url }, updateData);
                            console.log(`UPDATED: ${processedProduct.title} (${source}) - Category: ${updateData.category}, Subcategory: ${updateData.subcategory}`);
                            stats.total.updated++;
                            stats.bySource[source].updated++;

                            // Notify users if product is newly on sale
                            if (!wasOnSale && isNowOnSale) {
                                console.log(`SALE ALERT: ${processedProduct.title} is now on sale!`);
                                await notifyWishlistUsers(existingProduct._id, processedProduct);
                            }
                        } else {
                            console.log(`UNCHANGED: ${processedProduct.title} (${source})`);
                        }
                    } else {
                        const newProduct = await Product.create(processedProduct);
                        console.log(`ADDED: ${processedProduct.title} (${source}) - Category: ${processedProduct.category}, Subcategory: ${processedProduct.subcategory}`);
                        stats.total.added++;
                        stats.bySource[source].added++;
                    }
                }

                page++;
            }

            console.log(`Processed ${totalProducts} total products from ${source}`);
        } catch (error) {
            console.log(`Error updating products from ${source}: ${error.message}`, 'ERROR');
        }
    }

    // Find and delete products that no longer exist on the websites
    for (const url of existingUrls) {
        if (!processedUrls.has(url)) {
            const product = await Product.findOne({ url });
            if (product) {
                // Only delete products from sources we're currently processing
                const sourceIsInWebsites = websites.some(([_, source]) => source === product.source);
                if (sourceIsInWebsites) {
                    console.log(`DELETED: ${product.title} (${product.source}) - Not found in current products or doesn't match category structure`);
                    await Product.deleteOne({ url });
                    stats.total.deleted++;
                    if (stats.bySource[product.source]) {
                        stats.bySource[product.source].deleted++;
                    }
                }
            }
        }
    }

    // Print summary statistics
    console.log('\n===== PRODUCT UPDATE SUMMARY =====');
    console.log(`Total Products: Added: ${stats.total.added}, Updated: ${stats.total.updated}, Deleted: ${stats.total.deleted}`);

    console.log('\nBreakdown by Source:');
    for (const source in stats.bySource) {
        const sourceStats = stats.bySource[source];
        if (sourceStats.added > 0 || sourceStats.updated > 0 || sourceStats.deleted > 0) {
            console.log(`${source}: Added: ${sourceStats.added}, Updated: ${sourceStats.updated}, Deleted: ${sourceStats.deleted}`);
        }
    }
    console.log('================================\n');

    mongoose.disconnect();
    console.log('Finished updating products');

    return stats;
}

// Export the function for potential use as a module
module.exports = updateProducts;

if (require.main === module) {
    updateProducts()
        .then(() => {
            console.log('Product update completed successfully');
        })
        .catch(err => {
            console.error('Error running product updates:', err);
            process.exit(1);
        });
}