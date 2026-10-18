import { useState } from "react";
import { Alert } from "react-native";
import { ComposerLayout, Field } from "./ComposerUI";
import type { ComposerProps } from "./types";

export default function EventComposer({
  onSubmit,
  onCancel,
  submitting,
}: ComposerProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Meetup");

  const publish = async () => {
    if (
      ![title, description, date, startTime, endTime, location].every((v) =>
        v.trim(),
      )
    ) {
      Alert.alert(
        "Missing details",
        "Fill in the title, description, date, times, and location.",
      );
      return;
    }

    await onSubmit({
      type: "EVENT",
      title: title.trim(),
      caption: description.trim(),
      metadata: {
        category: category.trim() || "Meetup",
        date: date.trim(),
        start_time: startTime.trim(),
        end_time: endTime.trim(),
        location: location.trim(),
      },
    });
  };

  return (
    <ComposerLayout
      title="Create event"
      onCancel={onCancel}
      onSubmit={publish}
      submitting={submitting}>
      <Field
        label="Event title"
        value={title}
        onChangeText={setTitle}
        placeholder="e.g. Let's play cricket!"
        maxLength={100}
      />

      <Field
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="What should people know?"
        multiline
        maxLength={1000}
      />

      <Field
        label="Category"
        value={category}
        onChangeText={setCategory}
        placeholder="Meetup, Sports, Community..."
      />

      <Field
        label="Date"
        value={date}
        onChangeText={setDate}
        placeholder="e.g. 12 Oct 2026"
      />

      <Field
        label="Start time"
        value={startTime}
        onChangeText={setStartTime}
        placeholder="e.g. 4:00 PM"
      />

      <Field
        label="End time"
        value={endTime}
        onChangeText={setEndTime}
        placeholder="e.g. 7:00 PM"
      />

      <Field
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="Where is it happening?"
      />
    </ComposerLayout>
  );
}
