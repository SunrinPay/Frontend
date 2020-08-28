export interface StockItem {
	id?: string; // Firestore 도큐멘트 ID
	name: string; // 상품의 이름
	barcode: string; // 바코드 문자열
	quantity: number; // 재고
	price: number; // 가격
	discount: number; // 할인율
}
