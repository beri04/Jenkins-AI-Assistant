from src.rag.rag_engine import RAG_ENGINE

engine = RAG_ENGINE()
print("----Jenkins AI Assistant (CLI Mode)----")
print("Feel Free to Ask")
print("Type 'exit' to quit")
print("Modes in our AI " \
"1. Friendly" \
"2. Professional" \
"3. Rude" \
"4. Teacher" \
"5. Hinglish(buddy-mode)")
print("Select the Mode based on Numbering :)")
def select_change_mode():
    mode = input("Mode: ").strip().lower()
    return mode
while True:
    mode = select_change_mode()
    if mode == "exit":
        break
    while True:
        query = input("You: ").strip()
        if query == "exit":
            break
        if query == "change mode" or query == "mode change":
            break
        print("\nThinking...\n")
        answer = engine.answer(query,mode=mode)
        print(f"AI ({mode}): {answer}\n")
