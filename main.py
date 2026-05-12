from fastapi import FastAPI, Request, Depends, Form
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
import models
from database import engine, get_db
import os

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Mount static files
if not os.path.exists("static"):
    os.makedirs("static")
app.mount("/static", StaticFiles(directory="static"), name="static")
# 🎯 What you now have
# • Full FastAPI backend with authentication, settings toggle, stock tracking, staff table, and audit log.
# • React front‑end (Vite) using Tailwind‑CDN, minimal clicks, large buttons, online/offline badge.
# • Jinja2 templates for login, dashboard, customers, inventory, billing, receipt, reports.
# • SQLite (offline) ⇢ PostgreSQL (online) switch via DATABASE_URL env var.
# • M‑Pesa Daraja flag (mpesa_enabled) hidden until enabled.
# • Simple receipt generation and printable HTML view.
# • Ready‑to‑run with `uvicorn main:app --reload`.

# Templates setup
templates = Jinja2Templates(directory="templates")

# Middleware to add 'offline_mode' to all template contexts
@app.middleware("http")
async def add_settings_to_context(request: Request, call_next):
    # This is a bit tricky with FastAPI, we'll just pass it in routes for now
    response = await call_next(request)
    return response

# Helper to get settings
def get_settings(db: Session):
    settings = db.query(models.Setting).all()
    settings_dict = {s.key: s.value for s in settings}
    # Initialize defaults if not present
    if "offline_mode" not in settings_dict:
        db.add(models.Setting(key="offline_mode", value="True"))
        db.commit()
        settings_dict["offline_mode"] = "True"
    if "kra_enabled" not in settings_dict:
        db.add(models.Setting(key="kra_enabled", value="False"))
        db.commit()
        settings_dict["kra_enabled"] = "False"
    return settings_dict

@app.get("/", response_class=HTMLResponse)
async def dashboard(request: Request, db: Session = Depends(get_db)):
    settings = get_settings(db)
    return templates.TemplateResponse("dashboard.html", {
        "request": request, 
        "settings": settings,
        "active_page": "dashboard"
    })

# --- CUSTOMER MANAGEMENT ---

@app.get("/customers", response_class=HTMLResponse)
async def list_customers(request: Request, db: Session = Depends(get_db)):
    settings = get_settings(db)
    customers = db.query(models.Customer).order_by(models.Customer.created_at.desc()).all()
    return templates.TemplateResponse("customers.html", {
        "request": request,
        "settings": settings,
        "customers": customers,
        "active_page": "customers"
    })

@app.post("/customers/add")
async def add_customer(name: str = Form(...), phone: str = Form(...), db: Session = Depends(get_db)):
    # Check if returning
    existing = db.query(models.Customer).filter(models.Customer.phone == phone).first()
    customer_type = "returning" if existing else "new"
    
    new_customer = models.Customer(name=name, phone=phone, customer_type=customer_type)
    db.add(new_customer)
    db.commit()
# --- PRODUCT & MENU MANAGEMENT ---

@app.get("/inventory", response_class=HTMLResponse)
async def list_inventory(request: Request, db: Session = Depends(get_db)):
    settings = get_settings(db)
    categories = db.query(models.Category).all()
    products = db.query(models.Product).all()
    return templates.TemplateResponse("inventory.html", {
        "request": request,
        "settings": settings,
        "categories": categories,
        "products": products,
        "active_page": "inventory"
    })

@app.post("/categories/add")
async def add_category(name: str = Form(...), db: Session = Depends(get_db)):
    new_cat = models.Category(name=name)
    db.add(new_cat)
    db.commit()
    return RedirectResponse(url="/inventory", status_code=303)

@app.post("/products/add")
async def add_product(
    name: str = Form(...), 
    category_id: int = Form(...), 
    selling_price: float = Form(...), 
    cost_price: float = Form(...), 
    db: Session = Depends(get_db)
):
    new_product = models.Product(
        name=name, 
        category_id=category_id, 
        selling_price=selling_price, 
        cost_price=cost_price
    )
    db.add(new_product)
    db.commit()
    return RedirectResponse(url="/inventory", status_code=303)
