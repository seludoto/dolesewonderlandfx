#!/usr/bin/env python3
"""
Code generation script for DoleSe Wonderland FX platform.
This script generates boilerplate code for common patterns.
"""

import os
import sys
from datetime import datetime

def generate_api_endpoint(name, methods=None):
    """Generate a FastAPI endpoint template."""
    if methods is None:
        methods = ['GET']

    methods_code = []
    for method in methods:
        if method.upper() == 'GET':
            methods_code.append(f"""@router.get("/{name}")
async def get_{name}(db: Session = Depends(get_db)):
    \"\"\"Get {name} items.\"\"\"
    # TODO: Implement get logic
    return {{"message": "Get {name} endpoint"}}

""")
        elif method.upper() == 'POST':
            methods_code.append(f"""@router.post("/{name}")
async def create_{name}({name}_data: dict, db: Session = Depends(get_db)):
    \"\"\"Create a new {name} item.\"\"\"
    # TODO: Implement create logic
    return {{"message": "Create {name} endpoint", "data": {name}_data}}

""")
        elif method.upper() == 'PUT':
            methods_code.append(f"""@router.put("/{name}/{{item_id}}")
async def update_{name}(item_id: int, {name}_data: dict, db: Session = Depends(get_db)):
    \"\"\"Update a {name} item.\"\"\"
    # TODO: Implement update logic
    return {{"message": "Update {name} endpoint", "id": item_id, "data": {name}_data}}

""")
        elif method.upper() == 'DELETE':
            methods_code.append(f"""@router.delete("/{name}/{{item_id}}")
async def delete_{name}(item_id: int, db: Session = Depends(get_db)):
    \"\"\"Delete a {name} item.\"\"\"
    # TODO: Implement delete logic
    return {{"message": "Delete {name} endpoint", "id": item_id}}

""")

    template = f'''\"\"\"
{name.title()} API endpoints
\"\"\"
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import {name.title()}
from ..schemas import {name.title()}Create, {name.title()}Update

router = APIRouter(prefix="/api/v1/{name}", tags=["{name}"])

{''.join(methods_code)}
'''

    return template

def generate_sqlalchemy_model(name, fields=None):
    """Generate a SQLAlchemy model template."""
    if fields is None:
        fields = ['id: int', 'name: str', 'created_at: datetime']

    field_definitions = []
    for field in fields:
        field_name, field_type = field.split(':')
        field_name = field_name.strip()
        field_type = field_type.strip()

        if field_type == 'int':
            if field_name == 'id':
                field_definitions.append(f"    {field_name} = Column(Integer, primary_key=True, index=True)")
            else:
                field_definitions.append(f"    {field_name} = Column(Integer)")
        elif field_type == 'str':
            if field_name == 'name':
                field_definitions.append(f"    {field_name} = Column(String, index=True)")
            else:
                field_definitions.append(f"    {field_name} = Column(String)")
        elif field_type == 'datetime':
            field_definitions.append(f"    {field_name} = Column(DateTime, default=datetime.utcnow)")
        elif field_type == 'bool':
            field_definitions.append(f"    {field_name} = Column(Boolean, default=False)")
        elif field_type == 'float':
            field_definitions.append(f"    {field_name} = Column(Float)")

    template = f'''\"\"\"
{name.title()} database model
\"\"\"
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class {name.title()}(Base):
    \"\"\"{name.title()} model.\"\"\"
    __tablename__ = "{name.lower()}s"

{chr(10).join(field_definitions)}
'''

    return template

def generate_pydantic_schema(name, fields=None):
    """Generate a Pydantic schema template."""
    if fields is None:
        fields = ['id: int', 'name: str', 'created_at: datetime']

    field_definitions = []
    for field in fields:
        field_name, field_type = field.split(':')
        field_name = field_name.strip()
        field_type = field_type.strip()

        if field_type == 'int':
            field_definitions.append(f"    {field_name}: {field_type}")
        elif field_type == 'str':
            field_definitions.append(f"    {field_name}: {field_type}")
        elif field_type == 'datetime':
            field_definitions.append(f"    {field_name}: datetime")
        elif field_type == 'bool':
            field_definitions.append(f"    {field_name}: bool")
        elif field_type == 'float':
            field_definitions.append(f"    {field_name}: float")

    template = f'''\"\"\"
{name.title()} Pydantic schemas
\"\"\"
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class {name.title()}Base(BaseModel):
    \"\"\"Base {name} schema.\"\"\"
{chr(10).join(field_definitions[1:])}  # Exclude id for base

class {name.title()}Create({name.title()}Base):
    \"\"\"Schema for creating {name}.\"\"\"
    pass

class {name.title()}Update(BaseModel):
    \"\"\"Schema for updating {name}.\"\"\"
{chr(10).join([f"    {f.split(':')[0].strip()}: Optional[{f.split(':')[1].strip()}] = None" for f in fields[1:]])}

class {name.title()}({name.title()}Base):
    \"\"\"Full {name} schema.\"\"\"
{chr(10).join(field_definitions)}

    class Config:
        from_attributes = True
'''

    return template

def generate_react_component(name, component_type='functional'):
    """Generate a React component template."""
    if component_type == 'functional':
        template = f'''\"\"\"
{name} React component
\"\"\"
import React from 'react'

const {name} = ({{ className = '', ...props }}) => {{
  return (
    <div className={{`{name.toLowerCase()} ${{className}}`}} {{...props}}>
      {/* TODO: Implement {name} component */}
      <h2>{name} Component</h2>
      <p>This is the {name} component.</p>
    </div>
  )
}}

export default {name}
'''
    else:
        template = f'''\"\"\"
{name} React component (Class-based)
\"\"\"
import React, {{ Component }} from 'react'

class {name} extends Component {{
  render() {{
    const {{ className = '', ...props }} = this.props

    return (
      <div className={{{name.toLowerCase()} ${{className}}}} {{...props}}>
        {/* TODO: Implement {name} component */}
        <h2>{name} Component</h2>
        <p>This is the {name} component.</p>
      </div>
    )
  }}
}}

export default {name}
'''

    return template

def main():
    """Main function to run the code generation script."""
    if len(sys.argv) < 3:
        print("Usage: python generate.py <type> <name> [options]")
        print("Types:")
        print("  api <name> [methods]     - Generate FastAPI endpoint")
        print("  model <name> [fields]     - Generate SQLAlchemy model")
        print("  schema <name> [fields]    - Generate Pydantic schema")
        print("  component <name> [type]   - Generate React component")
        print("\nExamples:")
        print("  python generate.py api users GET,POST,PUT,DELETE")
        print("  python generate.py model user id:int,name:str,email:str,created_at:datetime")
        print("  python generate.py component UserCard functional")
        sys.exit(1)

    gen_type = sys.argv[1].lower()
    name = sys.argv[2]

    # Determine output directory based on type
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)

    if gen_type == 'api':
        output_dir = os.path.join(project_root, 'services', 'api')
        methods = sys.argv[3].split(',') if len(sys.argv) > 3 else ['GET']
        content = generate_api_endpoint(name, methods)
        filename = f"{name}_routes.py"
    elif gen_type == 'model':
        output_dir = os.path.join(project_root, 'services', 'api', 'models')
        fields = sys.argv[3].split(',') if len(sys.argv) > 3 else None
        content = generate_sqlalchemy_model(name, fields)
        filename = f"{name}.py"
    elif gen_type == 'schema':
        output_dir = os.path.join(project_root, 'services', 'api', 'schemas')
        fields = sys.argv[3].split(',') if len(sys.argv) > 3 else None
        content = generate_pydantic_schema(name, fields)
        filename = f"{name}.py"
    elif gen_type == 'component':
        component_type = sys.argv[3] if len(sys.argv) > 3 else 'functional'
        output_dir = os.path.join(project_root, 'shared', 'ui')
        content = generate_react_component(name, component_type)
        filename = f"{name}.js"
    else:
        print(f"Unknown generation type: {gen_type}")
        sys.exit(1)

    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Write the generated file
    output_path = os.path.join(output_dir, filename)
    try:
        with open(output_path, 'w') as f:
            f.write(content)
        print(f"Generated {gen_type}: {output_path}")
    except IOError as e:
        print(f"Error writing file: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()