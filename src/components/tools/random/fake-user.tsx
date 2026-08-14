"use client";

import React, { useEffect, useState } from "react";
import { RefreshCw, Mail, Phone, MapPin, Building2, Calendar, AtSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel, CopyButton, pick, randInt } from "@/components/tools/random/random-ui";
import { FIRST_NAMES_MALE, FIRST_NAMES_FEMALE, LAST_NAMES, CITIES, STREETS, COMPANIES } from "@/components/tools/random/data";

interface FakeUser {
  name: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  dob: string;
  age: number;
  initials: string;
}

const DOMAINS = ["example.com", "mail.com", "demo.dev", "test.io", "inbox.co"];

function makeUser(): FakeUser {
  const male = randInt(0, 1) === 0;
  const first = pick(male ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE);
  const last = pick(LAST_NAMES);
  const username = `${first.toLowerCase()}${last.toLowerCase()}${randInt(1, 99)}`;
  const year = randInt(1965, 2005);
  const month = randInt(1, 12);
  const day = randInt(1, 28);
  const dob = new Date(year, month - 1, day);
  const age = new Date().getFullYear() - year;
  return {
    name: `${first} ${last}`,
    username,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@${pick(DOMAINS)}`,
    phone: `+1 (${randInt(200, 999)}) ${randInt(200, 999)}-${String(randInt(0, 9999)).padStart(4, "0")}`,
    address: `${randInt(10, 9999)} ${pick(STREETS)}, ${pick(CITIES)}`,
    company: pick(COMPANIES),
    dob: dob.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
    age,
    initials: `${first[0]}${last[0]}`,
  };
}

function Row({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-border/30 py-2.5 last:border-0">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="break-words text-sm text-foreground">{value}</div>
      </div>
    </div>
  );
}

export function FakeUser() {
  const [user, setUser] = useState<FakeUser | null>(null);
  const generate = () => setUser(makeUser());
  useEffect(() => {
    generate();
  }, []);

  if (!user) return null;
  const json = JSON.stringify(user, null, 2);

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <Panel
        title="Fake user profile"
        actions={
          <>
            <CopyButton value={json} label="Copy JSON" />
            <Button size="sm" className="gap-1.5" onClick={generate}>
              <RefreshCw className="h-3.5 w-3.5" />
              New
            </Button>
          </>
        }
      >
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xl font-bold text-primary">
            {user.initials}
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">{user.name}</div>
            <div className="text-sm text-muted-foreground">@{user.username}</div>
          </div>
        </div>
        <div>
          <Row icon={Mail} label="Email" value={user.email} />
          <Row icon={Phone} label="Phone" value={user.phone} />
          <Row icon={MapPin} label="Address" value={user.address} />
          <Row icon={Building2} label="Company" value={user.company} />
          <Row icon={Calendar} label="Date of birth" value={`${user.dob} (age ${user.age})`} />
          <Row icon={AtSign} label="Username" value={user.username} />
        </div>
      </Panel>
      <p className="text-center text-xs text-muted-foreground">
        All data is randomly generated and fictional — for testing and mockups only.
      </p>
    </div>
  );
}
