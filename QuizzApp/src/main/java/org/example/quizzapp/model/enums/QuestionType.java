package org.example.quizzapp.model.enums;
import com.fasterxml.jackson.annotation.JsonValue;
import com.fasterxml.jackson.annotation.JsonCreator;


public enum QuestionType {
    MCQ("multiple-choice"),
    TRUE_FALSE("true-false"),
    SHORT_ANSWER("short-answer"),
    MULTIPLE_SELECT("multiple-select"),
    SINGLE_CHOICE("single-choice");

    private final String value;

    QuestionType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static QuestionType fromValue(String value) {
        for (QuestionType type : QuestionType.values()) {
            if (type.value.equalsIgnoreCase(value)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown question type: " + value);
    }

}
