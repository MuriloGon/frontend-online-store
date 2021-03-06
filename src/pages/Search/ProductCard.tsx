/* eslint-disable react/prop-types */
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactStarts from 'react-stars';
import AddToCartBtn from '../../components/CartButtonWrapper';
import { CartData } from '../../helpers/cart';
import { Result } from '../../helpers/mercadolibre/ProductQuery';
import {
  discountParse, discountWarn, freeShipping,
  installments, stylizedPrice,
} from '../../helpers/productInfo';
import { RootState } from '../../store';
import {
  Product, ProductContent, ProductImage,
} from './styles';

const ProductCard: FC<{ product: Result }> = ({ product }) => {
  const discount = discountParse(product.original_price, product.price);
  const safeTitle = product.title.replaceAll('%', '-').replaceAll(' ', '_').replaceAll('/', '-');
  const ids = useSelector((state: RootState) => state.cart.items).map(({ id }) => id);
  const avgRating = useSelector((st: RootState) => st.comments.comments)
    .find(({ id }) => id === product?.id)?.comments
    .reduce((acc, { rating }, index, arr) => {
      if (index === (arr.length - 1)) {
        return (acc + rating) / arr.length;
      }
      return acc + rating;
    }, 0);

  const data: CartData = {
    id: product.id,
    image: product.thumbnail,
    quantity: 1,
    title: product.title,
    price: product.price,
  };
  const selected = ids.includes(product.id);
  const outline = ids.includes(product.id) ? '4px dashed hsl(190deg,50%,50%)' : '';

  return (
    <AddToCartBtn selected={selected} productData={data}>
      <Link to={`/${product.id}-${safeTitle}`}>
        <Product style={{ outline }}>
          <ProductImage>
            <img src={`https://http2.mlstatic.com/D_NQ_NP_${product.thumbnail_id}-V.webp`} alt={product.title} />
          </ProductImage>
          <ProductContent>
            <ReactStarts size={25} value={avgRating} edit={false} className="stars" />
            {stylizedPrice(product.original_price, 'R$', 'oldPrice')}
            {stylizedPrice(product.price, 'R$', '', discount)}
            {installments(product)}
            {discountWarn(discount)}
            {freeShipping(product.shipping.free_shipping)}
            <div className="product-title">{product.title}</div>
          </ProductContent>
        </Product>
      </Link>
    </AddToCartBtn>
  );
};

export default ProductCard;
