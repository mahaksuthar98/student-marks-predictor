from .prediction import predict_and_save


# ==========================================
# MAIN PROGRAM
# ==========================================

def main():

    print()
    print("==============================")
    print("   STUDENT MARKS PREDICTOR")
    print("==============================")

    while True:

        print()
        print("1. Make New Prediction")
        print("2. Exit")

        choice = input("Enter your choice: ")

        # ==========================================
        # MAKE NEW PREDICTION
        # ==========================================

        if choice == "1":

            print()
            print("===== NEW PREDICTION =====")

            student_name = input(
                "Enter student name: "
            )

            study_hours = float(
                input("Enter study hours: ")
            )

            attendance = float(
                input("Enter attendance percentage: ")
            )

            previous_marks = float(
                input("Enter previous marks: ")
            )

            assignment_score = float(
                input("Enter assignment score: ")
            )

            predicted_marks = predict_and_save(
                student_name,
                study_hours,
                attendance,
                previous_marks,
                assignment_score
            )

            print()
            print("==============================")
            print(
                f"Predicted Marks: {predicted_marks:.2f}"
            )
            print("==============================")

        # ==========================================
        # EXIT
        # ==========================================

        elif choice == "2":

            print()
            print("Thank you for using Student Marks Predictor!")

            break

        else:

            print()
            print("Invalid choice. Please try again.")


# ==========================================
# RUN PROGRAM
# ==========================================

if __name__ == "__main__":
    main()