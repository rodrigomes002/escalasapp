import { DatePicker } from "@/components/shared/date-picker";
import { FormEscala } from "@/types/FormEscala";
import { Label } from "@radix-ui/react-label";

export const DateStep = ({
  formData,
  handleDate,
}: {
  formData: FormEscala;
  handleDate: (value: string) => void;
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="data">Dia do culto</Label>
        <DatePicker
          initialDate={formData.data}
          onDateSelect={(selectedDate) =>
            selectedDate ? handleDate(selectedDate) : ""
          }
          placeholder="Selecione a data"
        />
      </div>
    </div>
  );
};
