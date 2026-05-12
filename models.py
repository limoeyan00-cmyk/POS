from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Customer(Base):
    __tablename__ = "customers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, index=True)
    customer_type = Column(String, default="new") # new/returning
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    orders = relationship("Order", back_populates="customer")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    selling_price = Column(Float)
    cost_price = Column(Float)
    stock_quantity = Column(Integer, default=0)  # new: track inventory levels
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    category = relationship("Category", back_populates="products")

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"))
    status = Column(String, default="open") # open/paid/credit
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    customer = relationship("Customer", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    payments = relationship("Payment", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    quantity = Column(Integer)
    unit_price = Column(Float)
    order = relationship("Order", back_populates="items")

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    amount_paid = Column(Float)
    method = Column(String) # cash/mpesa/credit
    paid_at = Column(DateTime, default=datetime.datetime.utcnow)
    order = relationship("Order", back_populates="payments")

class Receipt(Base):
    __tablename__ = "receipts"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    receipt_number = Column(String, unique=True)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"
    id = Column(Integer, primary_key=True, index=True)
    mpesa_enabled = Column(Boolean, default=False)  # Set True to enable M-Pesa Daraja integration
    value = Column(String)

# New table to store staff credentials and roles
class Staff(Base):
    __tablename__ = "staff"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)  # store a hash, not plain text
    name = Column(String, nullable=False)
    role = Column(String, default="cashier")  # e.g. cashier, manager, admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# Simple audit log for critical actions (order creation, payment, stock change)
class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"))
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    details = Column(String)
    staff = relationship("Staff")
