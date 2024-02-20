import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { core } from "wailsjs/go/models";
import { ConnectToDB, ListTables } from "wailsjs/go/core/App";

const dbConfigSchema = z.object({
  host: z.string().min(1, "Host is required."),
  port: z
    .number()
    .min(1, "Port is required.")
    .or(z.string().min(1, "Port is required.")),
  user: z.string().min(1, "User is required."),
  password: z.string(),
  dbname: z.string().min(1, "Database name is required."),
  sslmode: z.string().min(1, "SSL Mode is required."),
});

function Connect() {
  const form = useForm<z.infer<typeof dbConfigSchema>>({
    resolver: zodResolver(dbConfigSchema),
    defaultValues: {
      host: "localhost",
      port: "5432",
      user: "root",
      password: "",
      dbname: "dev_db",
      sslmode: "",
    },
  });

  async function onSubmit(values: z.infer<typeof dbConfigSchema>) {
    // Handle submission with validated and typed values
    console.log(values);
    const config = core.DBConfig.createFrom(values);
    try {
      await ConnectToDB(config);
      const response = await ListTables();
      console.log({ tableNames: response.table_names });
    } catch (error) {
      console.error({ error });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="host"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Host</FormLabel>
                <FormControl>
                  <Input placeholder="localhost" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="port"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Port</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5432" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User</FormLabel>
                <FormControl>
                  <Input placeholder="yourusername" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="YourPassword"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dbname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Database Name</FormLabel>
                <FormControl>
                  <Input placeholder="mydatabase" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormItem>
            <FormLabel>SSL Mode</FormLabel>
            <FormControl>
              <Controller
                name="sslmode"
                control={form.control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-[201px]">
                      <SelectValue placeholder="SSL Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="disable">Disable</SelectItem>
                      <SelectItem value="allow">Allow</SelectItem>
                      <SelectItem value="prefer">Prefer</SelectItem>
                      <SelectItem value="require">Require</SelectItem>
                      <SelectItem value="verify-ca">Verify-CA</SelectItem>
                      <SelectItem value="verify-full">Verify-Full</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </FormControl>
          </FormItem>
        </div>
        <div className="flex justify-center mt-4">
          <Button type="submit">Connect</Button>
        </div>
      </form>
    </Form>
  );
}

export default Connect;
