from database import DataBase
from pre_processor import PreProcessor
from golden_Vectorizer import GoldenVectorizer
from vectorizer import Vectorizer
from comperator import Comperator

class Main:
  def __init__(self):
    pass
  
  def generate_golden_matrix(self, parameter):
    g_vec = GoldenVectorizer(parameter).main()

  def main(self, text, parameter):
    # create databse object for utility
    db = DataBase()

    # preprocessing
    pre_proc = PreProcessor(text).main()
    # vectorization
    semDesc_mat, golden_mat = Vectorizer(pre_proc, parameter).main()

    # temp storage
    # db.storeSemDescMatrix('semDesc_1', semDesc_mat)

    # comparision
    cmp_impact = Comperator().main(semDesc_mat, golden_mat)
    
    print(cmp_impact)

text = """The document presents a proposal for a smart waste management system aimed at optimizing waste collection in urban areas. 
It introduces IoT-based sensors to monitor waste levels in bins and proposes a mobile application for real-time tracking. 
The proposal highlights potential environmental benefits, including reduced waste overflow and efficient routing for garbage collection vehicles. 
The document includes a detailed cost analysis, implementation timeline, and scalability options for expanding the system to multiple regions. 
Additionally, it addresses potential challenges such as sensor maintenance and data security."""

run = Main()
# run.generate_golden_matrix('impact')
run.main(text, 'impact')