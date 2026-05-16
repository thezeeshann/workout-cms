"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { apiJson } from "@/lib/api/client";
import { SectionHeader } from "@/components/layout/section-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  splitType: z.enum([
    "push_pull_legs",
    "upper_lower",
    "full_body",
    "bro_split",
    "custom",
  ]),
  exercises: z
    .array(
      z.object({
        exerciseName: z.string().min(1),
        sets: z.coerce.number().int().positive().optional(),
        reps: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .min(1),
});

type FormValues = z.infer<typeof schema>;

export default function NewWorkoutPage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      splitType: "custom",
      exercises: [{ exerciseName: "", reps: "8-12", sets: 3 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  async function onSubmit(values: FormValues) {
    try {
      await apiJson("/workouts", {
        method: "POST",
        body: JSON.stringify({
          name: values.name,
          description: values.description || undefined,
          splitType: values.splitType,
          exercises: values.exercises.map((ex, index) => ({
            exerciseName: ex.exerciseName,
            sets: ex.sets,
            reps: ex.reps,
            sortOrder: index,
            notes: ex.notes,
          })),
        }),
      });
      toast.success("Workout created");
      router.push("/member/workouts");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="Build a workout">
        Define a split and exercise list, then assign it from the catalog.
      </SectionHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...form.register("name")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" {...form.register("description")} />
            </div>
            <div className="space-y-2">
              <Label>Split</Label>
              <Select
                value={form.watch("splitType")}
                onValueChange={(v) =>
                  form.setValue(
                    "splitType",
                    v as FormValues["splitType"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="push_pull_legs">Push / Pull / Legs</SelectItem>
                  <SelectItem value="upper_lower">Upper / Lower</SelectItem>
                  <SelectItem value="full_body">Full body</SelectItem>
                  <SelectItem value="bro_split">Bro split</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exercises</CardTitle>
            <CardDescription>Add lifts in order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border border-border p-4 sm:grid-cols-2"
              >
                <div className="space-y-2 sm:col-span-2">
                  <Label>Name</Label>
                  <Input
                    {...form.register(`exercises.${index}.exerciseName` as const)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sets</Label>
                  <Input
                    type="number"
                    {...form.register(`exercises.${index}.sets` as const)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reps</Label>
                  <Input {...form.register(`exercises.${index}.reps` as const)} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Notes</Label>
                  <Input {...form.register(`exercises.${index}.notes` as const)} />
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ exerciseName: "", sets: 3, reps: "8-12", notes: "" })
              }
            >
              Add exercise
            </Button>
          </CardContent>
        </Card>

        <Button type="submit">Save workout</Button>
      </form>
    </div>
  );
}
