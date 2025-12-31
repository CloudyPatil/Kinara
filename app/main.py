from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <--- Import this
from app.api.endpoints import auth, stays, bookings, admin, utils # <--- ADD utils HERE

app = FastAPI(title="Local Stay Platform")

# --- CORS CONFIGURATION ---
origins = ["*"] # Allow all origins (for development). Change this in production!

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow GET, POST, PUT, DELETE
    allow_headers=["*"], # Allow all headers (Auth tokens)
)
# --------------------------

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(stays.router, prefix="/api/v1/stays", tags=["Stays"])
app.include_router(bookings.router, prefix="/api/v1/bookings", tags=["Bookings"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(utils.router, prefix="/api/v1/utils", tags=["Utilities"]) # <--- ADD THIS LINE

@app.get("/")
def read_root():
    return {"message": "Welcome to the Local Stay Platform API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}