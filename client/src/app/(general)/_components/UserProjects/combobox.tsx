"use client";
import { cn } from "@/lib/serverUtils";
import { CommandList } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ProjectNames = { value: string; label: string };

interface props {
  projects: ProjectNames[];
  store?: {
    state: string;
    setState: (id: string) => void;
  };
}

export function Combobox({ projects, store }: props) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = store
    ? [store.state, store.setState]
    : React.useState("");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? shortenLabel(
                projects.find((project) => project.value === value)!.label,
              )
            : "Select Project..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search proj..." />
          <CommandEmpty>No project found.</CommandEmpty>
          <CommandGroup>
            <CommandList className="font-semibold">
              {projects.map((project) => (
                <CommandItem
                  key={project.value}
                  value={project.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === project.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {project.label}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function shortenLabel(label: string): string {
  return label.length > 16 ? label.substring(0, 16) + "..." : label;
}
