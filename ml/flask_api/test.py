from genericEvaluation.genericEvaluator import GenericEvaluator

evaluator = GenericEvaluator()

def test_hackathon():
    params = {"problem_statement": "derive an idea to make coding more accessible to blind people"}
    result = evaluator.hackathon(params)
    print(result["keywords"])

def test_mathsScience():
    params = {
        "topic": "calculus",
        "problem_statement": "find the derivative of f(x) = x^2 + 3x + 1",
        "solution": "f'(x) = 2x + 1"
    }
    result = evaluator.mathsScience(params)
    print(result)

def test_summary():
    params = {
        "topic": "calculus",
        "problem_statement": "find the derivative of f(x) = x^2 + 3x + 1",
        "solution": "f'(x) = 2x + 1"
    }
    result = evaluator.summary(params)
    print(result)

def test_program():
    params = {"problem_statement": "write a function to calculate the factorial of a number"}
    result = evaluator.program(params)
    print(result)

def test_language():
    params = {"solution": "घर की सफाई एक ऐसा काम है जिसे कई लोग नापसंद करते हैं, लेकिन यह कीटाणुओं के प्रसार को रोकता है और घर को अच्छा दिखने में मदद करता है।"}
    result = evaluator.language(params)
    # result: "Cleaning the house is a task that many people dislike, but it stops the spread of germs and helps the house look good."
    print(result)

print("Hello from test.py")
test_language()