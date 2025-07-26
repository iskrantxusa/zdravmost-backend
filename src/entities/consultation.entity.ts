import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { EmrRecord } from './emr-record.entity';
import { Payment } from './payment.entity';

export enum ConsultationStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
}

@Entity('consultations')
export class Consultation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'appointment_id' })
  appointmentId: string;

  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.WAITING,
  })
  status: ConsultationStatus;

  @Column({ name: 'agora_room_id', nullable: true })
  agoraRoomId: string;

  @Column({ name: 'agora_channel_name', nullable: true })
  agoraChannelName: string;

  @Column({ name: 'agora_token', nullable: true })
  agoraToken: string;

  @Column({ name: 'agora_uid', nullable: true })
  agoraUid: string;

  @Column({ name: 'recording_url', nullable: true })
  recordingUrl: string;

  @Column({ name: 'recording_id', nullable: true })
  recordingId: string;

  @Column({ name: 'recording_enabled', default: false })
  recordingEnabled: boolean;

  @Column({ name: 'started_at', nullable: true })
  startedAt: Date;

  @Column({ name: 'ended_at', nullable: true })
  endedAt: Date;

  @Column({ name: 'duration_seconds', nullable: true })
  durationSeconds: number;

  @Column({ name: 'connection_quality', type: 'jsonb', nullable: true })
  connectionQuality: any;

  @Column({ name: 'technical_issues', type: 'text', array: true, nullable: true })
  technicalIssues: string[];

  @Column({ name: 'doctor_joined_at', nullable: true })
  doctorJoinedAt: Date;

  @Column({ name: 'patient_joined_at', nullable: true })
  patientJoinedAt: Date;

  @Column({ name: 'doctor_left_at', nullable: true })
  doctorLeftAt: Date;

  @Column({ name: 'patient_left_at', nullable: true })
  patientLeftAt: Date;

  @Column({ name: 'prescription_issued', default: false })
  prescriptionIssued: boolean;

  @Column({ name: 'follow_up_scheduled', default: false })
  followUpScheduled: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Appointment, (appointment) => appointment.consultation)
  @JoinColumn({ name: 'appointment_id' })
  appointment: Appointment;

  @OneToMany(() => EmrRecord, (emrRecord) => emrRecord.consultation)
  emrRecords: EmrRecord[];

  @OneToMany(() => Payment, (payment) => payment.consultation)
  payments: Payment[];
}
