import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Modal from './components/Modal';
import Button from './components/Button';
import Toast from './components/Toast';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 12;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;

interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  rating: number;
  description: string;
  category: string;
}

export default function App() {
  const [cart, setCart] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as const });

  const products: Product[] = [
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 129.99, 
      emoji: '🎧', 
      rating: 4.5,
      description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
      category: 'Audio'
    },
    { 
      id: 2, 
      name: 'Smart Watch', 
      price: 299.99, 
      emoji: '⌚', 
      rating: 4.8,
      description: 'Feature-packed smartwatch with fitness tracking and heart rate monitor.',
      category: 'Wearables'
    },
    { 
      id: 3, 
      name: 'Laptop Stand', 
      price: 49.99, 
      emoji: '💻', 
      rating: 4.2,
      description: 'Ergonomic aluminum laptop stand with adjustable height and angle.',
      category: 'Accessories'
    },
    { 
      id: 4, 
      name: 'USB-C Cable', 
      price: 19.99, 
      emoji: '🔌', 
      rating: 4.6,
      description: 'Durable braided USB-C cable with fast charging support.',
      category: 'Cables'
    },
    { 
      id: 5, 
      name: 'Wireless Mouse', 
      price: 39.99, 
      emoji: '🖱️', 
      rating: 4.4,
      description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
      category: 'Accessories'
    },
    { 
      id: 6, 
      name: 'Portable Speaker', 
      price: 79.99, 
      emoji: '🔊', 
      rating: 4.7,
      description: 'Waterproof Bluetooth speaker with 360° sound and 12-hour playtime.',
      category: 'Audio'
    },
  ];

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ visible: true, message, type });
  };

  const addToCart = (productId: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCart([...cart, productId]);
    const product = products.find(p => p.id === productId);
    showToast(`${product?.name} added to cart!`, 'success');
  };

  const handleProductPress = (product: Product) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const cartTotal = cart.reduce((total, productId) => {
    const product = products.find(p => p.id === productId);
    return total + (product?.price || 0);
  }, 0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Shop</Text>
          <Text style={styles.headerSubtitle}>Discover amazing products</Text>
        </View>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (cart.length > 0) {
              showToast(`Cart total: $${cartTotal.toFixed(2)}`, 'info');
            } else {
              showToast('Your cart is empty', 'warning');
            }
          }}
        >
          <Ionicons name="cart-outline" size={28} color="#1C1C1E" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Featured Products</Text>

        <View style={styles.productsGrid}>
          {products.map(product => (
            <TouchableOpacity
              key={product.id}
              style={styles.productCard}
              onPress={() => handleProductPress(product)}
              activeOpacity={0.7}
            >
              {/* Large Square Image Container */}
              <View style={styles.productImageContainer}>
                <Text style={styles.productEmoji}>{product.emoji}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.ratingText}>{product.rating}</Text>
                </View>
              </View>

              {/* Product Info */}
              <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                <View style={styles.productFooter}>
                  <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      addToCart(product.id);
                    }}
                  >
                    <Ionicons name="add" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <View style={styles.cartSummary}>
            <View style={styles.cartSummaryContent}>
              <View>
                <Text style={styles.cartSummaryTitle}>Cart Summary</Text>
                <Text style={styles.cartSummaryItems}>{cart.length} item{cart.length !== 1 ? 's' : ''}</Text>
              </View>
              <View style={styles.cartSummaryRight}>
                <Text style={styles.cartSummaryTotal}>${cartTotal.toFixed(2)}</Text>
                <Button
                  title="Checkout"
                  onPress={() => showToast('Checkout feature coming soon!', 'info')}
                  variant="primary"
                  size="small"
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Product Detail Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Product Details"
      >
        {selectedProduct && (
          <View style={styles.modalContent}>
            <View style={styles.modalImageContainer}>
              <Text style={styles.modalEmoji}>{selectedProduct.emoji}</Text>
            </View>

            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderLeft}>
                <Text style={styles.modalCategory}>{selectedProduct.category}</Text>
                <Text style={styles.modalName}>{selectedProduct.name}</Text>
              </View>
              <View style={styles.modalRating}>
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.modalRatingText}>{selectedProduct.rating}</Text>
              </View>
            </View>

            <Text style={styles.modalDescription}>{selectedProduct.description}</Text>

            <View style={styles.modalPriceRow}>
              <View>
                <Text style={styles.modalPriceLabel}>Price</Text>
                <Text style={styles.modalPrice}>${selectedProduct.price.toFixed(2)}</Text>
              </View>
              <Button
                title="Add to Cart"
                onPress={() => {
                  addToCart(selectedProduct.id);
                  setModalVisible(false);
                }}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        )}
      </Modal>

      {/* Toast Notification */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast(prev => ({ ...prev, visible: false }))}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: CARD_MARGIN,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1C1C1E',
    marginTop: 20,
    marginBottom: 16,
    marginHorizontal: CARD_MARGIN,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: CARD_MARGIN / 2,
    marginBottom: CARD_MARGIN,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  productEmoji: {
    fontSize: 64,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 4,
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    lineHeight: 20,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF9500',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartSummary: {
    marginTop: 20,
    marginHorizontal: CARD_MARGIN,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cartSummaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  cartSummaryItems: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  cartSummaryRight: {
    alignItems: 'flex-end',
  },
  cartSummaryTotal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF9500',
    marginBottom: 8,
  },
  bottomPadding: {
    height: 40,
  },
  modalContent: {
    flex: 1,
  },
  modalImageContainer: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalEmoji: {
    fontSize: 120,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flex: 1,
  },
  modalCategory: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: 32,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  modalRatingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginLeft: 6,
  },
  modalDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 24,
    marginBottom: 32,
  },
  modalPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  modalPriceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF9500',
  },
});