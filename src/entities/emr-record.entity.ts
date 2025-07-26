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

export enum EmrRecordType {
  DIAGNOSIS = 'diagnosis',
  PRESCRIPTION = 'prescription',
  LAB_RESULT = 'lab_result',
  VITAL_SIGNS = 'vital_signs',
  NOTES = 'notes',
  TREATMENT_PLAN = 'treatment_plan',
  FOLLOW_UP = 'follow_up',
  REFERRAL = 'referral',
}

@Entity('emr_records')
export class EmrRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'consultation_id' })
  consultationId: string;

  @Column({
    type: 'enum',
    enum: EmrRecordType,
  })
  type: EmrRecordType;

  @Column({ type: 'jsonb' })
  data: any;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by' })
  createdBy: string; // ID врача, который создал запись

  @Column({ name: 'is_sensitive', default: false })
  isSensitive: boolean; // Для особо чувствительных данных

  @Column({ name: 'is_encrypted', default: false })
  isEncrypted: boolean; // Флаг шифрования данных

  @Column({ type: 'text', array: true, nullable: true })
  attachments: string[]; // URLs к прикрепленным файлам

  @Column({ type: 'jsonb', nullable: true })
  metadata: any; // Метаданные для поиска и индексации

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Consultation, (consultation) => consultation.emrRecords)
  @JoinColumn({ name: 'consultation_id' })
  consultation: Consultation;
}

// Интерфейсы для типизации данных в JSONB полях
export interface DiagnosisData {
  icd10Code: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
  status: 'preliminary' | 'confirmed' | 'ruled_out';
  differentialDiagnoses?: string[];
}

export interface PrescriptionData {
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    quantity?: number;
  }>;
  pharmacyInstructions?: string;
}

export interface VitalSignsData {
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  bmi?: number;
}

export interface LabResultData {
  testName: string;
  results: Array<{
    parameter: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'abnormal' | 'critical';
  }>;
  labName?: string;
  performedDate: Date;
}

export interface TreatmentPlanData {
  objectives: string[];
  interventions: Array<{
    type: string;
    description: string;
    frequency?: string;
    duration?: string;
  }>;
  expectedOutcomes: string[];
  reviewDate?: Date;
}
