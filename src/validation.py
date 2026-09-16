def get_student_name():
    while True:
        name = input("Enter student name: ").strip()

        if name:
            return name

        print("Student name cannot be empty.")


def get_number(prompt, minimum=None, maximum=None):
    while True:
        try:
            value = float(input(prompt))

            if minimum is not None and value < minimum:
                print(f"Value must be at least {minimum}.")
                continue

            if maximum is not None and value > maximum:
                print(f"Value must not be greater than {maximum}.")
                continue

            return value

        except ValueError:
            print("Please enter a valid number.")