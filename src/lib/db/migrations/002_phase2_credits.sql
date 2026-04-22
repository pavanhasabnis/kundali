-- Phase 2: starter-credit tracking.
--
-- Adds a boolean-ish flag on users to track whether the one-time Starter ₹99
-- upgrade credit has been applied (prevents double-claims), and a discount
-- amount column on payments so we retain an audit trail of applied credits.

ALTER TABLE users ADD COLUMN starter_credit_applied INTEGER DEFAULT 0;
ALTER TABLE payments ADD COLUMN discount_amount INTEGER DEFAULT 0;
