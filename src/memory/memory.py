class Memory:
    def __init__(self):
        self.history = []
    
    def add(self,query,answer):
        self.history.append({"query":query, "answer":answer})

    def get_history(self):
        return self.history
    
if __name__ == "__main__":
    m = Memory()
    print(m.get_history())