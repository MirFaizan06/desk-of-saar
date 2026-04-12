import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Match ${dark ? 'A' : 'B'}
    # Be careful with nested quotes. The simplest is to match the exact string pattern.
    # regex for: \$\{dark \? ['"`](.*?)['"`] : ['"`](.*?)['"`]\}
    
    # Actually, a simpler way is to evaluate the ternaries since there are variables and different types of quotes.
    # Because we know `dark` is false, we can just replace `dark ? A : B` with `B`.
    
    def replacer_ternary(match):
        true_val = match.group(1)
        false_val = match.group(2)
        return false_val
        
    # Let's match `dark ? '...' : '...'`
    # We will just find all occurrences of `dark \? ([^:]+) : ([^}]+)`... this is hard to parse with regex if there are nested ternaries or colons in tailwind classes like hover:bg.
    
    # Let's use a simpler approach:
    # 1. remove `import { useTheme } from '../context/ThemeContext';`
    # 2. remove `const { dark } = useTheme();`
    # 3. For the ternaries, since they are mostly simple strings like `dark ? 'bg-black' : 'bg-white'`, we can match them.
    
    content = content.replace("import { useTheme } from '../context/ThemeContext';", "")
    content = content.replace("const { dark } = useTheme();", "")
    
    # Let's match `${dark ? 'A' : 'B'}`
    content = re.sub(r"\$\{dark \? '([^']*)' : '([^']*)'\}", r"\2", content)
    
    # Let's match `{dark ? 'A' : 'B'}`
    content = re.sub(r"\{dark \? '([^']*)' : '([^']*)'\}", r"'\2'", content)
    
    # Let's match `dark ? 'A' : 'B'` (without brackets/braces sometimes)
    content = re.sub(r"dark \? '([^']*)' : '([^']*)'", r"'\2'", content)

    # Some might use double quotes or template literals inside like: dark ? "..." : "..."
    content = re.sub(r'\$\{dark \? "([^"]*)" : "([^"]*)"\}', r"\2", content)
    
    # What about dark ? true : false
    content = content.replace("dark ?", "false ?")
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Cleaned {filepath}")

for root, dirs, files in os.walk(r'd:\MyProjects\desk-of-saar\src'):
    for file in files:
        if file.endswith('.jsx'):
            clean_file(os.path.join(root, file))

