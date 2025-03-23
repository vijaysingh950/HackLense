import json
from scipy.sparse import save_npz, load_npz
import pickle

class DataBase:
  def __init__(self):
    pass

  def getKeywords(self, parameter):
    f = open("./database/keywords.json", 'r')
    data = json.load(f)
    f.close()
    return data.get(parameter)

  def storeModel(self, name, model, matrix):
    # golden matrix
    save_npz(f'./database/{name}.npz', matrix)
    # model
    f = open(f'./database/{name}.pkl', 'wb')
    pickle.dump(model, f)

  def loadModel(self, name):
    # golden matrix
    golden_mat = load_npz(f'./database/{name}.npz')
    # model
    f = open(f'./database/{name}.pkl', 'rb')
    model = pickle.load(f)
    return model, golden_mat

  def storeSemDescMatrix(self, name, matrix):
    np.save(f"./temp/{name}.npy", matrix)

  def loadSemDescMatrix(self, name):
    return np.load(f"./temp/{name}.npy")
