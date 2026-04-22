import os
import re

def strip_js_java_comments(text):
    # Match //... or /*...*/ or string literals ('...' or "..." or `...`)
    pattern = r'(//[^\n]*)|(/\*.*?\*/)|(\'+?(?:\\.|[^\'\\])*\'+?)|(\"+?(?:\\.|[^\"\\])*\"+?)|(`+?(?:\\.|[^`\\])*`+?)'
    
    def repl(m):
        # If it's a comment (group 1 or 2), return empty string. Else return the matched string literal
        if m.group(1) or m.group(2): return ''
        return m.group(0)

    # Apply replacement
    return re.sub(pattern, repl, text, flags=re.DOTALL)

def strip_html_comments(text):
    return re.sub(r'<!--(.*?)-->', '', text, flags=re.DOTALL)

def strip_css_comments(text):
    return re.sub(r'/\*.*?\*/', '', text, flags=re.DOTALL)

def clean_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        text = f.read()
        
    orig = text
    if path.endswith('.html'):
        text = strip_html_comments(text)
    elif path.endswith('.css'):
        text = strip_css_comments(text)
    elif path.endswith('.js') or path.endswith('.java'):
        text = strip_js_java_comments(text)
        
    if text != orig:
        # Also trim multiple empty lines
        text = re.sub(r'\n\s*\n\s*\n', '\n\n', text)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f'Cleaned {os.path.basename(path)}')

directory = r'd:\IWT Project\b_JBaVqcpF9AB\src\main'
for root, _, files in os.walk(directory):
    for f in files:
        if f.endswith(('.html', '.css', '.js', '.java')):
            clean_file(os.path.join(root, f))
