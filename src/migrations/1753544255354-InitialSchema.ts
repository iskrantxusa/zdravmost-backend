import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1753544255354 implements MigrationInterface {
    name = 'InitialSchema1753544255354'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."patient_profiles_gender_enum" AS ENUM('male', 'female', 'other')`);
        await queryRunner.query(`CREATE TABLE "patient_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "date_of_birth" TIMESTAMP, "gender" "public"."patient_profiles_gender_enum", "height" integer, "weight" integer, "blood_type" character varying, "allergies" text array, "medications" text array, "medical_history" jsonb, "emergency_contact_name" character varying, "emergency_contact_phone" character varying, "emergency_contact_relation" character varying, "address" character varying, "city" character varying, "country" character varying, "postal_code" character varying, "insurance_provider" character varying, "insurance_policy_number" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_e296010b9088277148d109ba75" UNIQUE ("user_id"), CONSTRAINT "PK_7297a6976f065cc75e798674aa8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."emr_records_type_enum" AS ENUM('diagnosis', 'prescription', 'lab_result', 'vital_signs', 'notes', 'treatment_plan', 'follow_up', 'referral')`);
        await queryRunner.query(`CREATE TABLE "emr_records" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "consultation_id" uuid NOT NULL, "type" "public"."emr_records_type_enum" NOT NULL, "data" jsonb NOT NULL, "notes" text, "created_by" character varying NOT NULL, "is_sensitive" boolean NOT NULL DEFAULT false, "is_encrypted" boolean NOT NULL DEFAULT false, "attachments" text array, "metadata" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_cc16878092989473917a8a79b2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."payments_provider_enum" AS ENUM('stripe', 'paypal', 'bank_transfer', 'credit_card', 'insurance')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_type_enum" AS ENUM('consultation_fee', 'prescription_fee', 'follow_up_fee', 'cancellation_fee', 'refund')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "consultation_id" uuid NOT NULL, "provider" "public"."payments_provider_enum" NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "type" "public"."payments_type_enum" NOT NULL DEFAULT 'consultation_fee', "amount" numeric(10,2) NOT NULL, "currency" character varying NOT NULL DEFAULT 'USD', "provider_transaction_id" character varying, "provider_payment_intent_id" character varying, "provider_response" jsonb, "payment_method_id" character varying, "payment_method_type" character varying, "customer_id" character varying, "invoice_id" character varying, "receipt_url" character varying, "refund_amount" numeric(10,2), "refund_reason" character varying, "refunded_at" TIMESTAMP, "processed_at" TIMESTAMP, "failed_at" TIMESTAMP, "failure_reason" character varying, "payment_metadata" jsonb, "fee_amount" numeric(10,2), "net_amount" numeric(10,2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."consultations_status_enum" AS ENUM('waiting', 'in_progress', 'completed', 'cancelled', 'failed')`);
        await queryRunner.query(`CREATE TABLE "consultations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "appointment_id" uuid NOT NULL, "status" "public"."consultations_status_enum" NOT NULL DEFAULT 'waiting', "agora_room_id" character varying, "agora_channel_name" character varying, "agora_token" character varying, "agora_uid" character varying, "recording_url" character varying, "recording_id" character varying, "recording_enabled" boolean NOT NULL DEFAULT false, "started_at" TIMESTAMP, "ended_at" TIMESTAMP, "duration_seconds" integer, "connection_quality" jsonb, "technical_issues" text array, "doctor_joined_at" TIMESTAMP, "patient_joined_at" TIMESTAMP, "doctor_left_at" TIMESTAMP, "patient_left_at" TIMESTAMP, "prescription_issued" boolean NOT NULL DEFAULT false, "follow_up_scheduled" boolean NOT NULL DEFAULT false, "notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_590a17c3e9eeda5c69cb7bd594" UNIQUE ("appointment_id"), CONSTRAINT "PK_c5b78e9424d9bc68464f6a12103" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_status_enum" AS ENUM('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')`);
        await queryRunner.query(`CREATE TYPE "public"."appointments_type_enum" AS ENUM('consultation', 'follow_up', 'emergency')`);
        await queryRunner.query(`CREATE TABLE "appointments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "doctor_id" uuid NOT NULL, "patient_id" uuid NOT NULL, "scheduled_at" TIMESTAMP NOT NULL, "duration_minutes" integer NOT NULL DEFAULT '30', "status" "public"."appointments_status_enum" NOT NULL DEFAULT 'scheduled', "type" "public"."appointments_type_enum" NOT NULL DEFAULT 'consultation', "reason" text, "notes" text, "patient_symptoms" text, "cancellation_reason" text, "cancelled_by" character varying, "cancelled_at" TIMESTAMP, "confirmed_at" TIMESTAMP, "started_at" TIMESTAMP, "ended_at" TIMESTAMP, "reminder_sent" boolean NOT NULL DEFAULT false, "follow_up_required" boolean NOT NULL DEFAULT false, "follow_up_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."doctor_profiles_status_enum" AS ENUM('pending', 'verified', 'suspended')`);
        await queryRunner.query(`CREATE TABLE "doctor_profiles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "license_number" character varying NOT NULL, "specialization" character varying NOT NULL, "bio" text, "years_experience" integer NOT NULL DEFAULT '0', "education" jsonb, "certifications" jsonb, "languages" jsonb, "consultation_fee" numeric(10,2) NOT NULL, "status" "public"."doctor_profiles_status_enum" NOT NULL DEFAULT 'pending', "average_rating" numeric(3,2) NOT NULL DEFAULT '0', "total_reviews" integer NOT NULL DEFAULT '0', "total_consultations" integer NOT NULL DEFAULT '0', "working_hours" jsonb, "is_available" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_74465b9308295c2c90b880d76c8" UNIQUE ("license_number"), CONSTRAINT "REL_69995f9059305ab7a9c52cdb10" UNIQUE ("user_id"), CONSTRAINT "PK_b07c128005f6a0d0135d6e7353b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('patient', 'doctor', 'admin')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive', 'suspended')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "phone" character varying, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "avatar" character varying, "role" "public"."users_role_enum" NOT NULL DEFAULT 'patient', "status" "public"."users_status_enum" NOT NULL DEFAULT 'active', "email_verified" boolean NOT NULL DEFAULT false, "phone_verified" boolean NOT NULL DEFAULT false, "last_login" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "patient_profiles" ADD CONSTRAINT "FK_e296010b9088277148d109ba75a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "emr_records" ADD CONSTRAINT "FK_b4222b716c8d03f0c15d33eb44e" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_60e9e7a83c417fe2dd0b95d245f" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "consultations" ADD CONSTRAINT "FK_590a17c3e9eeda5c69cb7bd594b" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2" FOREIGN KEY ("doctor_id") REFERENCES "doctor_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "appointments" ADD CONSTRAINT "FK_3330f054416745deaa2cc130700" FOREIGN KEY ("patient_id") REFERENCES "patient_profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "doctor_profiles" ADD CONSTRAINT "FK_69995f9059305ab7a9c52cdb10e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_profiles" DROP CONSTRAINT "FK_69995f9059305ab7a9c52cdb10e"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_3330f054416745deaa2cc130700"`);
        await queryRunner.query(`ALTER TABLE "appointments" DROP CONSTRAINT "FK_4cf26c3f972d014df5c68d503d2"`);
        await queryRunner.query(`ALTER TABLE "consultations" DROP CONSTRAINT "FK_590a17c3e9eeda5c69cb7bd594b"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_60e9e7a83c417fe2dd0b95d245f"`);
        await queryRunner.query(`ALTER TABLE "emr_records" DROP CONSTRAINT "FK_b4222b716c8d03f0c15d33eb44e"`);
        await queryRunner.query(`ALTER TABLE "patient_profiles" DROP CONSTRAINT "FK_e296010b9088277148d109ba75a"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "doctor_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."doctor_profiles_status_enum"`);
        await queryRunner.query(`DROP TABLE "appointments"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."appointments_status_enum"`);
        await queryRunner.query(`DROP TABLE "consultations"`);
        await queryRunner.query(`DROP TYPE "public"."consultations_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
        await queryRunner.query(`DROP TABLE "emr_records"`);
        await queryRunner.query(`DROP TYPE "public"."emr_records_type_enum"`);
        await queryRunner.query(`DROP TABLE "patient_profiles"`);
        await queryRunner.query(`DROP TYPE "public"."patient_profiles_gender_enum"`);
    }

}
