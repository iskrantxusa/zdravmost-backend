import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Consultation } from './consultation.entity';

export enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CREDIT_CARD = 'credit_card',
  INSURANCE = 'insurance',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially_refunded',
}

export enum PaymentType {
  CONSULTATION_FEE = 'consultation_fee',
  PRESCRIPTION_FEE = 'prescription_fee',
  FOLLOW_UP_FEE = 'follow_up_fee',
  CANCELLATION_FEE = 'cancellation_fee',
  REFUND = 'refund',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'consultation_id' })
  consultationId: string;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider: PaymentProvider;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentType,
    default: PaymentType.CONSULTATION_FEE,
  })
  type: PaymentType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ name: 'provider_transaction_id', nullable: true })
  providerTransactionId: string;

  @Column({ name: 'provider_payment_intent_id', nullable: true })
  providerPaymentIntentId: string;

  @Column({ name: 'provider_response', type: 'jsonb', nullable: true })
  providerResponse: any;

  @Column({ name: 'payment_method_id', nullable: true })
  paymentMethodId: string;

  @Column({ name: 'payment_method_type', nullable: true })
  paymentMethodType: string; // card, bank_account, etc.

  @Column({ name: 'customer_id', nullable: true })
  customerId: string; // Stripe customer ID or similar

  @Column({ name: 'invoice_id', nullable: true })
  invoiceId: string;

  @Column({ name: 'receipt_url', nullable: true })
  receiptUrl: string;

  @Column({ name: 'refund_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  refundAmount: number;

  @Column({ name: 'refund_reason', nullable: true })
  refundReason: string;

  @Column({ name: 'refunded_at', nullable: true })
  refundedAt: Date;

  @Column({ name: 'processed_at', nullable: true })
  processedAt: Date;

  @Column({ name: 'failed_at', nullable: true })
  failedAt: Date;

  @Column({ name: 'failure_reason', nullable: true })
  failureReason: string;

  @Column({ name: 'payment_metadata', type: 'jsonb', nullable: true })
  paymentMetadata: any;

  @Column({ name: 'fee_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  feeAmount: number; // Комиссия платежной системы

  @Column({ name: 'net_amount', type: 'decimal', precision: 10, scale: 2, nullable: true })
  netAmount: number; // Сумма к получению после комиссии

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Consultation, (consultation) => consultation.payments)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;
}
