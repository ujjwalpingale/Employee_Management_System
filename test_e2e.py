import urllib.request
import urllib.error
import json

BASE_URL = "http://127.0.0.1:8000"

def request(method, path, data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
        
    encoded_data = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        print(f"Error {e.code} on {method} {path}: {e.read().decode()}")
        raise

try:
    print("1. Registering User...")
    try:
        request("POST", "/auth/register", {"username": "testadmin", "email": "admin@test.com", "password": "password123", "role": "admin"})
    except urllib.error.HTTPError:
        print("   (User already exists, proceeding...)")
        
    print("2. Logging in...")
    token_resp = request("POST", "/auth/login", {"username": "testadmin", "password": "password123"})
    token = token_resp["access_token"]
    
    print("3. Creating Department...")
    dept = request("POST", "/departments/", {"name": "Engineering", "description": "Tech dept"}, token)
    dept_id = dept["id"]
    print(f"   Created Department ID: {dept_id}")
    
    print("4. Creating Employee...")
    import random
    unique_email = f"john.doe.{random.randint(1000,9999)}@test.com"
    emp = request("POST", "/employees/", {
        "name": "John Doe",
        "email": unique_email,
        "salary": 75000,
        "designation": "Software Engineer",
        "joining_date": "2026-06-20",
        "department_id": dept_id
    }, token)
    emp_id = emp["id"]
    print(f"   Created Employee ID: {emp_id}")
    
    print("5. Getting Employees (Pagination & Filter)...")
    emps = request("GET", f"/employees/?search=John&department_id={dept_id}&size=5", token=token)
    print(f"   Found matching items: {len(emps['items'])}")
    
    print("6. Deleting Employee...")
    request("DELETE", f"/employees/{emp_id}", token=token)
    print("   Deleted Employee.")
    
    print("7. Deleting Department...")
    request("DELETE", f"/departments/{dept_id}", token=token)
    print("   Deleted Department.")
    
    print("====================")
    print("ALL TESTS PASSED SEAMLESSLY! \u2705")
    print("====================")
except Exception as e:
    print("TESTS FAILED:", e)
